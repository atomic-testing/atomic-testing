import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { basicChipExample, basicChipTestSuite } from './BasicChip.examples';
import { clickableChipExample, clickableChipTestSuite } from './ClickableChip.examples';
import { deletableChipExample, deletableChipTestSuite } from './DeletableChip.examples';

export {
  basicChipExample,
  basicChipTestSuite,
  clickableChipExample,
  clickableChipTestSuite,
  deletableChipExample,
  deletableChipTestSuite,
};

export const chipExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicChipExample,
  clickableChipExample,
  deletableChipExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
