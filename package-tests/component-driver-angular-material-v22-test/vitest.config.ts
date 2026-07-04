import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// The DOM side of the shared suites runs through AngularInteractor in a real
// browser (Vitest browser mode), under two projects: with zone.js loaded and
// without (zoneless) — mirroring package-tests/angular-*-test. A real browser
// (not jsdom) is deliberate: ADR-013 rejected jsdom for Angular fixtures, and
// Angular Material's overlays lean on the native Popover API that jsdom lacks
// (jsdom/jsdom#3721).
//
// Angular components in this package are JIT-compiled at runtime (the setup
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
      include: ['__tests__/**/*.dom.test.ts'],
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
