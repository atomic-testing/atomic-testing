import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { tagPickerExample, tagPickerExampleTestSuite } from './TagPicker.suite';

export { tagPickerUIExample } from './TagPicker.examples';
export { tagPickerExample, tagPickerExampleTestSuite };

export const tagPickerExamples = [tagPickerExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
