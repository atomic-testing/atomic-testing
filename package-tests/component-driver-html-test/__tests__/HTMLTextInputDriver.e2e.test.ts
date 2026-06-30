import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import {
  controlledTextInputExampleTestSuite,
  textInputCapabilitiesExampleTestSuite,
  uncontrolledTextInputExampleTestSuite,
} from '../src/examples';

testRunner(uncontrolledTextInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(controlledTextInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(textInputCapabilitiesExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
