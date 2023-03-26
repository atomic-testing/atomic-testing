import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { controlledTextInputExampleTestSuite, uncontrolledTextInputExampleTestSuite } from '../src/examples';

testRunner(uncontrolledTextInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(controlledTextInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
