import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { uncontrolledRadioButtonGroupExample, uncontrolledRadioButtonGroupTestSuite } from './Uncontrolled.suite';

export { uncontrolledRadioButtonGroupExample, uncontrolledRadioButtonGroupTestSuite };

export const radioButtonGroupExamples = [uncontrolledRadioButtonGroupExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
