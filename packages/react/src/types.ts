import { ITestEngine, ITestEngineOption } from '@testzilla/core';

export interface IReactTestEngineOption extends ITestEngineOption {
  rootElement?: Element;
  parentEngine?: ITestEngine;
}

export interface IReactTestEngineResult {
  engine: ITestEngine;
  cleanUp: () => void;
}