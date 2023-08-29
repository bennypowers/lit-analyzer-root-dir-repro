## Lit Analyzer TypeScript Monorepo Root Dir Reproduction

As of [170e9164][commit], I observed a bug in analyzer's handling of a
typescript monorepo. In my case, I wished to analyze two packages listed as npm
workspaces, each with their own tsconfig which extends from a shared tsconfig

```
/
/package.json # private monorepo root package.json
/tsconfig.settings.json # monorepo shared typescript settings
/elements/
         /package.json # public package.json for @patternfly/elements
         /tsconfig.json # extends ../tsconfig.settings.json
/core/pfe-core/
              /package.json # public package.json for @patternfly/pfe-core
              /tsconfig.json # extends ../../tsconfig.settings.json
```

[commit]: https://github.com/lit/lit/commit/170e91648472d21ecee3fca9ac7a0a52787b6e98
