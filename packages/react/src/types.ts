import { IComponentDriverOption } from '@testzilla/core';

export interface IReactTestEngineOption extends IComponentDriverOption {
  rootElement?: Element;
}
