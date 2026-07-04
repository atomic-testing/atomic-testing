import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

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
    // Force a single @angular/* instance. @atomic-testing/angular-core's dist
    // would otherwise resolve its own devDependency copy (Angular 20) while
    // this fixture's components use Angular 22 — mixing two copies breaks DI
    // (NG0203) and JIT compilation. Workspace-only wrinkle: published
    // consumers resolve the peer range to their single copy. Mirrors the
    // React dedupe in jest.config.base.js and the React test apps' vite
    // configs.
    resolve: {
      dedupe: ['@angular/common', '@angular/compiler', '@angular/core', '@angular/platform-browser', 'rxjs', 'zone.js'],
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
