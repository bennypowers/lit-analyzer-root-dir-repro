## Lit Analyzer TypeScript Monorepo Root Dir Reproduction

I observed a bug in analyzer's handling of a typescript monorepo. In my case, I 
wished to analyze two packages listed as npm workspaces, each with their own 
tsconfig which extends from a shared tsconfig

```
.
├── README.md
├── a
│   ├── a.ts
│   ├── package.json
│   └── tsconfig.json
├── analyze.ts
├── b
│   ├── b.ts
│   ├── package.json
│   └── tsconfig.json
├── declaration.d.ts
├── package.json
└── tsconfig.json

3 directories, 12 files

```

This reproduction demonstrates how using `includes` instead of `files`
causes analyzer to lose track of which package is being analyzed.

The necessary setup is:

- the monorepo's shared tsconfig (`/tsconfig.json`) must have a `files` list 
which includes a declaration file
- the sibling package's tsconfig (`/tsconfig.json`) must use `includes`, not 
`files`

A workaround for this is to duplicate the declaration file in the sibling 
packages rather than rely on the shared declaration.


To reproduce, `npm ci`, then separately checkout lit at [170e9164][commit], 
build it, `npm link` it against this package, and run `npm run analyze`. Note
that the assertion fails, finding the monorepo's package name instead of the
sibling's:

```
analyzing in /Users/bennyp/Developer/lit-analyzer-root-dir-repro/b
  calling createPackageAnalyzer(/Users/bennyp/Developer/lit-analyzer-root-dir-repro/b)...
    analyzer.commandLine.fileNames:
      [
        '/Users/bennyp/Developer/lit-analyzer-root-dir-repro/declaration.d.ts',
        '/Users/bennyp/Developer/lit-analyzer-root-dir-repro/b/b.ts'
      ]
    analyzer.program.getCurrentDirectory():
      /Users/bennyp/Developer/lit-analyzer-root-dir-repro/b
  calling analyzer.getPackage()...
    rootDir: /Users/bennyp/Developer/lit-analyzer-root-dir-repro
    packageJson.name: lit-analyzer-root-dir-repro
  calling generateManifest(pkg)...
    module paths: [ 'not/implemented', 'b/b.js' ]
  Assertion failed: expect package to be "b"
```

[commit]: https://github.com/lit/lit/commit/170e91648472d21ecee3fca9ac7a0a52787b6e98
