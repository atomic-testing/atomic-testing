import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { multipleSelectTestSuite, singleSelectTestSuite } from '../src/examples';

testRunner(singleSelectTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(multipleSelectTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
