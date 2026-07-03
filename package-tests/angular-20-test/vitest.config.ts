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
