import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { hoverCardExample, hoverCardExampleTestSuite } from './HoverCard.suite';

export { hoverCardUIExample } from './HoverCard.examples';
export { hoverCardExample, hoverCardExampleTestSuite };

export const hoverCardExamples = [hoverCardExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
