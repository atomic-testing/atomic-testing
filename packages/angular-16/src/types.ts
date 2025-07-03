import { IComponentDriverOption } from '@atomic-testing/core';
import { TestModuleMetadata } from '@angular/core/testing';

export interface IAngularTestEngineOption extends IComponentDriverOption {
  rootElement?: Element;
  moduleMetadata?: TestModuleMetadata;
}
