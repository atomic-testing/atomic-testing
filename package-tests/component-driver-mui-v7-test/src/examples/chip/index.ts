import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicChipUIExample } from './BasicChip.examples';
import { basicChipExample, basicChipTestSuite } from './BasicChip.suite';
import { clickableChipUIExample } from './ClickableChip.examples';
import { clickableChipExample, clickableChipTestSuite } from './ClickableChip.suite';
import { deletableChipUIExample } from './DeletableChip.examples';
import { deletableChipExample, deletableChipTestSuite } from './DeletableChip.suite';

export {
  basicChipUIExample,
  basicChipExample,
  basicChipTestSuite,
  clickableChipUIExample,
  clickableChipExample,
  clickableChipTestSuite,
  deletableChipUIExample,
  deletableChipExample,
  deletableChipTestSuite,
};

export const chipExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicChipExample,
  clickableChipExample,
  deletableChipExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
