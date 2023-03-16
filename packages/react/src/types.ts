import { IComponentDriverOption } from '@atomic-testing/core';

export interface IReactTestEngineOption extends IComponentDriverOption {
  rootElement?: Element;
  /**
   * When true, it would use React 17 or before to render react component, default is false.
   */
  legacyRender?: boolean;
}
