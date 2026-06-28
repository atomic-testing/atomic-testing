import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { contextMenuExample, contextMenuExampleTestSuite } from './ContextMenu.suite';

export { contextMenuExample, contextMenuExampleTestSuite };

export const contextMenuExamples = [contextMenuExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
