import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { markdownExample, markdownExampleTestSuite } from './Markdown.suite';

export { markdownUIExample } from './Markdown.examples';
export { markdownExample, markdownExampleTestSuite };

export const markdownExamples = [markdownExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
