import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicTooltipUIExample } from './BasicTooltip.example';
import { basicTooltipExample, basicTooltipTestSuite } from './BasicTooltip.suite';

export { basicTooltipUIExample, basicTooltipExample, basicTooltipTestSuite };

export const tooltipExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicTooltipExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
