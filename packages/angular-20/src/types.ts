import { IComponentDriverOption } from '@atomic-testing/core';

export interface IAngularTestEngineOption extends IComponentDriverOption {
  rootElement?: Element;
}
