import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { basicAutoCompleteTestSuite } from '../src/examples';

testRunner(basicAutoCompleteTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
