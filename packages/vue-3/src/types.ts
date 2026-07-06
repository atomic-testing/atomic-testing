import { ITestEngineOption } from '@atomic-testing/core';
import { Plugin } from 'vue';

/**
 * A Vue plugin to install on the test app, optionally with its options —
 * the same shape Vue's `app.use(plugin, ...options)` and
 * `@testing-library/vue`'s `global.plugins` accept.
 */
export type VuePluginInput = Plugin | [Plugin, ...unknown[]];

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
