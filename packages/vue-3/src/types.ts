import { ITestEngineOption } from '@atomic-testing/core';

/**
 * @deprecated Use {@link ITestEngineOption} from `@atomic-testing/core`.
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
