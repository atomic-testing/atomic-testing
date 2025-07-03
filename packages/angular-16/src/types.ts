import { TestModuleMetadata } from '@angular/core/testing';
import { IComponentDriverOption } from '@atomic-testing/core';

export interface IAngularTestEngineOption extends IComponentDriverOption {
  rootElement?: Element;
  moduleMetadata?: TestModuleMetadata;
}
