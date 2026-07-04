import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// CHROMIUM_EXECUTABLE lets sandboxed dev environments point at a preinstalled
// Chromium (mirroring package-tests/storybook-test); CI and normal dev
// machines resolve the browser through Playwright's registry (npx playwright
// install chromium).
const executablePath = process.env.CHROMIUM_EXECUTABLE;

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
    // Force a single @angular/* instance. @atomic-testing/angular-core's dist
    // would otherwise resolve its own devDependency copy of Angular while the
    // examples use this package's — mixing two copies breaks DI (NG0203) and
    // JIT compilation. Workspace-only wrinkle: published consumers resolve
    // the peer range to their single copy. Mirrors the React dedupe in
    // jest.config.base.js and the React test apps' vite configs.
    resolve: {
      dedupe: ['@angular/common', '@angular/compiler', '@angular/core', '@angular/platform-browser', 'rxjs', 'zone.js'],
    },
    // Pre-bundle every Angular entry the examples touch. Vitest's initial
    // scan only sees the test files, so on a cold cache the Material
    // subpackages are discovered mid-run; the re-optimization then serves the
    // JIT-linked components a second, raw copy of @angular/core whose internal
    // state is separate from the pre-bundled one (NG0203-style breakage —
    // `firstCreatePass` null in providersResolver). Listing the entries makes
    // the first run deterministic.
    optimizeDeps: {
      include: [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/forms',
        '@angular/material/button',
        '@angular/material/checkbox',
        '@angular/material/form-field',
        '@angular/material/input',
        '@angular/material/radio',
        '@angular/material/slide-toggle',
        '@angular/material/tabs',
        '@angular/platform-browser',
        'rxjs',
        'zone.js',
      ],
    },
    test: {
      name,
      include: ['__tests__/**/*.dom.test.ts'],
      setupFiles: [`./src/setup.${name}.ts`],
      browser: {
        enabled: true,
        headless: true,
        screenshotFailures: false,
        provider: playwright(executablePath ? { launchOptions: { executablePath } } : {}),
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
