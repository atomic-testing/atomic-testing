import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { contextMenuExample, contextMenuExampleTestSuite } from './ContextMenu.suite';

export { contextMenuExample, contextMenuExampleTestSuite };

export const contextMenuExamples = [contextMenuExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
