import { ByAttributeSource } from './byAttribute';
import { ByCheckedSource } from './byChecked';
import { ByCssClassSource } from './byCssClass';
import { ByCssSelectorSource } from './byCssSelector';
import { ByDataTestIdSource } from './byDataTestId';
import { ByInputTypeSource } from './byInputType';
import { ByNameSource } from './byName';
import { ByRoleSource } from './byRole';
import { ByTagNameSource } from './byTagName';
import { ByValueSource } from './byValue';

export type CssLocatorSource =
  | ByAttributeSource
  | ByCheckedSource
  | ByCssClassSource
  | ByCssSelectorSource
  | ByDataTestIdSource
  | ByInputTypeSource
  | ByNameSource
  | ByRoleSource
  | ByTagNameSource
  | ByValueSource;
