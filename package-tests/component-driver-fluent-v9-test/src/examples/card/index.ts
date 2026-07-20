import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { cardExample, cardExampleTestSuite } from './Card.suite';

export { cardUIExample } from './Card.examples';
export { cardExample, cardExampleTestSuite };

export const cardExamples = [cardExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
