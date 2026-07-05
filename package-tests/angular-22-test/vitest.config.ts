import path from 'node:path';

import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// Force a single Angular instance for this test package. @atomic-testing/
// angular-core's dist has real runtime imports of @angular/core and
// @angular/platform-browser (createApplication, ApplicationRef, etc.); Node
// resolves those bare specifiers relative to angular-core's OWN physical
// directory, not this consuming package's, so without this alias every
// angular-*-test would silently bootstrap against whatever Angular major
// angular-core's devDependencies happen to pin — the exact "two React
// instances" class of bug jest.config.base.js's reactModuleMappings fixes for
// react-core, here for Vite instead of Jest. Each angular-NN-test aliases to
// its OWN installed major so the component (compiled by this package's
// @angular/core) and the bootstrap call (inside angular-core's dist) agree.
// A plain-string `find` in Vite's alias also matches subpath imports (e.g.
// `@angular/core/primitives/signals`), redirecting them at the package root
// and breaking resolution — anchor with a regex so only the bare specifier
// itself is aliased, leaving subpath imports to resolve normally.
const angularModuleAliases = ['@angular/core', '@angular/common', '@angular/compiler', '@angular/platform-browser'].map(
  name => ({ find: new RegExp(`^${name}$`), replacement: path.resolve(__dirname, 'node_modules', name) })
);

// The same test files run under two projects: with zone.js loaded and without
// (zoneless). Settling must be correct in both — see issue #1013.
//
// Angular components in this fixture are JIT-compiled at runtime (the setup
// files import @angular/compiler), so no Angular build plugin is needed — the
// transformer only has to handle the (legacy) decorators, which it picks up
// from the root tsconfig's `experimentalDecorators`.
//
// A factory (not a shared object): Vitest stamps resolved state onto the
// browser config object, so sharing one instance across projects collides.
function browserProject(name: 'zone' | 'zoneless') {
  return {
    resolve: {
      alias: angularModuleAliases,
    },
    test: {
      name,
      include: ['__tests__/**/*.test.ts'],
      setupFiles: [`./src/setup.${name}.ts`],
      browser: {
        enabled: true,
        headless: true,
        screenshotFailures: false,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
    },
  };
}

export default defineConfig({
  test: {
    projects: [browserProject('zone'), browserProject('zoneless')],
  },
});
