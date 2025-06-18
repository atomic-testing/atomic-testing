import { IComponentDriverOption } from '@atomic-testing/core';

export interface IReactTestEngineOption extends IComponentDriverOption {
  rootElement?: Element;
}
