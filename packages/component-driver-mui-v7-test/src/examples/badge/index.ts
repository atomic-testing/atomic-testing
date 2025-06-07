import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicBadgeUIExample } from './BasicBadge.examples';
import { basicBadgeExample, basicBadgeTestSuite } from './BasicBadge.suite';

export { basicBadgeUIExample, basicBadgeExample, basicBadgeTestSuite };

export const badgeExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicBadgeExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
