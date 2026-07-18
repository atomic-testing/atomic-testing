import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { tagsExample, tagsExampleTestSuite } from './Tags.suite';

export { tagsUIExample } from './Tags.examples';
export { tagsExample, tagsExampleTestSuite };

export const tagsExamples = [tagsExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
