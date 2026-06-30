import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { uncontrolledRadioButtonGroupExample, uncontrolledRadioButtonGroupTestSuite } from './Uncontrolled.suite';

export { uncontrolledRadioButtonGroupExample, uncontrolledRadioButtonGroupTestSuite };

export const radioButtonGroupExamples = [uncontrolledRadioButtonGroupExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
