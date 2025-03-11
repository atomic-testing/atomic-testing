import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { uncontrolledRadioButtonGroupExample as uncontrolledRadioButtonGroup } from './Uncontrolled.examples';

export { uncontrolledRadioButtonGroupTestSuite } from './Uncontrolled.examples';

export const uncontrolledRadioButtonGroupExample = uncontrolledRadioButtonGroup;

export const radioButtonGroupExamples = [uncontrolledRadioButtonGroupExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
