import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { appShellExample, appShellExampleTestSuite } from './AppShell.suite';

export { appShellUIExample } from './AppShell.examples';
export { appShellExample, appShellExampleTestSuite };

export const appShellExamples = [appShellExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
