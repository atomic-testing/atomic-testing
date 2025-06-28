import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { controlledTextInputExampleTestSuite, uncontrolledTextInputExampleTestSuite } from '../src/examples';

testRunner(uncontrolledTextInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(controlledTextInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
