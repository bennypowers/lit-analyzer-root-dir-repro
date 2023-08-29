import type { AbsolutePath } from '@lit-labs/analyzer';

import * as path from 'node:path';
import { createPackageAnalyzer } from '@lit-labs/analyzer/package-analyzer.js';
import { generateManifest } from '@lit-labs/gen-manifest';

const [, , inPath] = process.argv;

console.group(`analyzing in ${process.cwd()}`);
const expectedPackage = process.cwd().split('/').pop();

const packagePath = path.join(process.cwd(), inPath);

console.group(`calling createPackageAnalyzer(${packagePath})...`);

const analyzer = createPackageAnalyzer(packagePath as AbsolutePath);

console.group(`analyzer.commandLine.fileNames:`);
console.log(analyzer.commandLine.fileNames);
console.groupEnd();

console.group('analyzer.program.getCurrentDirectory():');
console.log(analyzer.program.getCurrentDirectory());
console.groupEnd();

console.groupEnd();

console.group('calling analyzer.getPackage()...');

const pkg =  analyzer.getPackage();

const { rootDir, packageJson } = pkg

console.log(`rootDir: ${rootDir}`);
console.log(`packageJson.name: ${packageJson.name}`);
console.groupEnd();

console.group('calling generateManifest(pkg)...');

const filetree = await generateManifest(pkg)

const [[filename, fileTreeOrString]] = Object.entries(filetree);

const manifest = JSON.parse(fileTreeOrString as string);

console.log('module paths:', manifest.modules.map((x: any) => x.path));
console.groupEnd();

console.assert(packageJson.name === expectedPackage,`expect package to be "${expectedPackage}"`)
console.groupEnd();

