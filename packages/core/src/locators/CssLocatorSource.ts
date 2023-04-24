import { ByAttributeSource } from './byAttribute';
import { ByCheckedSource } from './byChecked';
import { ByCssClassSource } from './byCssClass';
import { ByCssSelectorSource } from './byCssSelector';
import { ByDataTestIdSource } from './byDataTestId';

export type CssLocatorSource =
  | object
  | ByAttributeSource
  | ByCheckedSource
  | ByCssClassSource
  | ByCssSelectorSource
  | ByDataTestIdSource;
