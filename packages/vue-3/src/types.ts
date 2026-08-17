import { ITestEngineOption } from '@atomic-testing/core';
import type { RenderOptions } from '@testing-library/vue';

/**
 * A Vue plugin to install on the test app, optionally with its options —
 * the same shape Vue's `app.use(plugin, ...options)` accepts.
 *
 * Derived from `@testing-library/vue`'s own `global.plugins` type rather than
 * re-declared from Vue's `Plugin`, so the two are identical by construction.
 * A re-declaration is only equal while both resolve the same `vue` type
 * instance: with two `vue` copies in the tree (a layout pnpm can produce),
 * `Plugin`-from-copy-A is not assignable to `Plugin`-from-copy-B, and the
 * v0.103.0 release was blocked by exactly that mismatch surfacing in CI.
 */
export type VuePluginInput = NonNullable<NonNullable<RenderOptions<unknown>['global']>['plugins']>[number];

/**
 * Option for the Vue `createTestEngine`. Extends the shared engine option with
 * app-level bootstrap Vue apps commonly need (plugins such as a design system's
 * config plugin, a router, or a store) — component libraries like PrimeVue
 * refuse to render without their plugin installed on the hosting app.
 */
export interface VueTestEngineOption extends ITestEngineOption {
  /**
   * Plugins installed on the test app before the subject renders, in order.
   */
  plugins?: VuePluginInput[];
}

/**
 * @deprecated Use {@link VueTestEngineOption} (or {@link ITestEngineOption}
 * from `@atomic-testing/core` when no Vue-specific option is needed).
 */
export type IVueTestEngineOption = ITestEngineOption;

// Simple SFC-like object interface for template-based components
export interface VueSFCLikeComponent {
  template: string;
  setup?: () => any;
  data?: () => any;
  methods?: Record<string, (...args: any[]) => any>;
  computed?: Record<string, () => any>;
  name?: string;
  props?: any;
}
