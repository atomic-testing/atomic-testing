import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { swatchPickerExample, swatchPickerExampleTestSuite } from './SwatchPicker.suite';

export { swatchPickerUIExample } from './SwatchPicker.examples';
export { swatchPickerExample, swatchPickerExampleTestSuite };

export const swatchPickerExamples = [swatchPickerExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
