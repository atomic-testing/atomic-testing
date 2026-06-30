import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { textInputCapabilitiesExample, textInputCapabilitiesExampleTestSuite } from './Capabilities.suite';
import { controlledTextInputExample, controlledTextInputExampleTestSuite } from './Controlled.suite';
import { uncontrolledTextInputExample, uncontrolledTextInputExampleTestSuite } from './Uncontrolled.suite';

export {
  controlledTextInputExampleTestSuite,
  textInputCapabilitiesExampleTestSuite,
  uncontrolledTextInputExampleTestSuite,
};
export { controlledTextInputExample, textInputCapabilitiesExample, uncontrolledTextInputExample };

export const textInputExamples = [
  uncontrolledTextInputExample,
  controlledTextInputExample,
  textInputCapabilitiesExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
