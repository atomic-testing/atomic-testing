import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { colorPickerExample, colorPickerExampleTestSuite } from './ColorPicker.suite';

export { colorPickerUIExample } from './ColorPicker.examples';
export { colorPickerExample, colorPickerExampleTestSuite };

export const colorPickerExamples = [colorPickerExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
