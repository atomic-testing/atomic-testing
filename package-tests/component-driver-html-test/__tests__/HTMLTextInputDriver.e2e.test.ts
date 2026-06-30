import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import {
  controlledTextInputExampleTestSuite,
  textInputCapabilitiesExampleTestSuite,
  uncontrolledTextInputExampleTestSuite,
} from '../src/examples';

testRunner(uncontrolledTextInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(controlledTextInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(textInputCapabilitiesExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
