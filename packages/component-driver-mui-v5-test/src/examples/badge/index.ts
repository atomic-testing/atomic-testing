import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { basicBadgeExample, basicBadgeTestSuite } from './BasicBadge.examples';

export { basicBadgeExample, basicBadgeTestSuite };

export const badgeExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicBadgeExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
