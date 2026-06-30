import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { commandPaletteExample, commandPaletteExampleTestSuite } from './CommandPalette.suite';

export { commandPaletteUIExample } from './CommandPalette.examples';
export { commandPaletteExample, commandPaletteExampleTestSuite };

export const commandPaletteExamples = [commandPaletteExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
