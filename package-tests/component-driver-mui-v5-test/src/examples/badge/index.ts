import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicBadgeUIExample } from './BasicBadge.examples';
import { basicBadgeExample, basicBadgeTestSuite } from './BasicBadge.suite';

export { basicBadgeUIExample, basicBadgeExample, basicBadgeTestSuite };

export const badgeExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicBadgeExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
