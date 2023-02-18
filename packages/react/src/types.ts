import { ITestEngine, ITestEngineOption, ScenePart } from '@testzilla/core';

export interface IReactTestEngineOption extends ITestEngineOption {
  rootElement?: Element;
  parentEngine?: ITestEngine;
}

export interface IReactTestEngineResult<T extends ScenePart> {
  engine: ITestEngine<T>;
  cleanUp: () => void;
}
