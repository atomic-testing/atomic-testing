import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { tooltipExample, tooltipExampleTestSuite } from './Tooltip.suite';

export { tooltipUIExample } from './Tooltip.examples';
export { tooltipExample, tooltipExampleTestSuite };

export const tooltipExamples = [tooltipExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
