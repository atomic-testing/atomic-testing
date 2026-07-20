import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { infoLabelExample, infoLabelExampleTestSuite } from './InfoLabel.suite';

export { infoLabelUIExample } from './InfoLabel.examples';
export { infoLabelExample, infoLabelExampleTestSuite };

export const infoLabelExamples = [infoLabelExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
