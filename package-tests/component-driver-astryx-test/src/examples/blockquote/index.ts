import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { blockquoteExample, blockquoteExampleTestSuite } from './Blockquote.suite';

export { blockquoteUIExample } from './Blockquote.examples';
export { blockquoteExample, blockquoteExampleTestSuite };

export const blockquoteExamples = [blockquoteExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
