/**
 * Single source of truth for the third-party ranges the scaffolder emits, plus
 * the `@atomic-testing/*` version line (derived from this package's own version).
 *
 * The recipe catalog references these constants rather than hard-coding ranges
 * per recipe, so a peer-range change is a one-line edit here — and
 * `scripts/check-recipe-sync.mjs` fails CI if any value here drifts from the real
 * per-package manifests (REC-SYNC-*). The `@atomic-testing/*` version is NOT
 * hand-maintained: it is read from this package's `package.json`, which the
 * release process bumps in lockstep across every `@atomic-testing/*` package, so
 * it can never go stale (as a hard-coded literal did when the 0.97.0 bump updated
 * the manifests but not the constant, and the `[skip ci]` bump hid it).
 */

import pkg from '../package.json';
import type { DependencySpec } from './types';

/** The `@atomic-testing/*` line this build of the scaffolder targets. */
export const ATOMIC_VERSION: string = pkg.version;

/** The range emitted for every `@atomic-testing/*` dependency. */
export const ATOMIC_RANGE = `^${ATOMIC_VERSION}`;

/** Build a dependency spec for an `@atomic-testing/*` package (runtime dep). */
export function atomicDep(shortName: string): DependencySpec {
  return { name: `@atomic-testing/${shortName}`, range: ATOMIC_RANGE, dev: true };
}

/**
 * Third-party ranges the scaffolder installs. Each must SATISFY the matching
 * engine/driver peer range in the real packages (asserted by the sync-check),
 * and be no looser than that peer where the peer is a hard bound.
 */
export const THIRD_PARTY = {
  // React runtimes (dev deps in a test-only setup; a real app already has them
  // as runtime deps, and the package manager dedupes).
  react18: { name: 'react', range: '^18.3.1' },
  reactDom18: { name: 'react-dom', range: '^18.3.1' },
  typesReact18: { name: '@types/react', range: '^18.3.0', dev: true },
  typesReactDom18: { name: '@types/react-dom', range: '^18.3.0', dev: true },

  react19: { name: 'react', range: '^19.2.0' },
  reactDom19: { name: 'react-dom', range: '^19.2.0' },
  typesReact19: { name: '@types/react', range: '^19.2.0', dev: true },
  typesReactDom19: { name: '@types/react-dom', range: '^19.2.0', dev: true },

  react17: { name: 'react', range: '^17.0.2' },
  reactDom17: { name: 'react-dom', range: '^17.0.2' },
  typesReact17: { name: '@types/react', range: '^17.0.0', dev: true },
  typesReactDom17: { name: '@types/react-dom', range: '^17.0.0', dev: true },

  // Testing Library
  tlReact: { name: '@testing-library/react', range: '^16.2.0', dev: true },
  tlDom: { name: '@testing-library/dom', range: '^10.4.1', dev: true },
  tlUserEvent: { name: '@testing-library/user-event', range: '^14.6.1', dev: true },
  tlVue: { name: '@testing-library/vue', range: '^8.1.0', dev: true },

  // Vue
  vue: { name: 'vue', range: '^3.5.0' },
  vueCompilerSfc: { name: '@vue/compiler-sfc', range: '^3.5.0', dev: true },

  // Angular runtime (per major filled in by the framework plugin)
  zoneJs: { name: 'zone.js', range: '^0.15.0' },
  rxjs: { name: 'rxjs', range: '^7.8.0' },

  // Runners
  jest: { name: 'jest', range: '^29.7.0', dev: true },
  jestEnvJsdom: { name: 'jest-environment-jsdom', range: '^29.7.0', dev: true },
  swcJest: { name: '@swc/jest', range: '^0.2.37', dev: true },
  swcCore: { name: '@swc/core', range: '^1.7.0', dev: true },
  typesJest: { name: '@types/jest', range: '^29.5.0', dev: true },
  vitest: { name: 'vitest', range: '^4.1.9', dev: true },
  jsdom: { name: 'jsdom', range: '^25.0.0', dev: true },
  vitestBrowserPlaywright: { name: '@vitest/browser-playwright', range: '^4.1.9', dev: true },
  playwright: { name: 'playwright', range: '^1.61.1', dev: true },
  playwrightTest: { name: '@playwright/test', range: '^1.61.1', dev: true },
  vitePluginVue: { name: '@vitejs/plugin-vue', range: '^5.0.0', dev: true },

  // Language
  typescript: { name: 'typescript', range: '^5.6.0', dev: true },

  // Design systems
  emotionReact: { name: '@emotion/react', range: '^11.14.0' },
  emotionStyled: { name: '@emotion/styled', range: '^11.14.1' },
  primevue: { name: 'primevue', range: '^4.0.0' },
  primeuixThemes: { name: '@primeuix/themes', range: '^2.0.0' },
  radixUi: { name: 'radix-ui', range: '^1.0.0' },
  cmdk: { name: 'cmdk', range: '^1.0.0', optional: true },
  astryxCore: { name: '@astryxdesign/core', range: '^0.1.3' },
  fluentReactComponents: { name: '@fluentui/react-components', range: '^9.0.0' },
} as const satisfies Record<string, DependencySpec>;
