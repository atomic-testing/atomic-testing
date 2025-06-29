import { IComponentDriverOption } from '@atomic-testing/core';

export interface IVueTestEngineOption extends IComponentDriverOption {
  rootElement?: Element;
}

// Simple SFC-like object interface for template-based components
export interface VueSFCLikeComponent {
  template: string;
  setup?: () => any;
  data?: () => any;
  methods?: Record<string, Function>;
  computed?: Record<string, Function>;
  name?: string;
  props?: any;
}
