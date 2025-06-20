import { IComponentDriverOption } from '@atomic-testing/core';

export interface IVueTestEngineOption extends IComponentDriverOption {
  rootElement?: Element;
}
