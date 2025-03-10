import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { accountMenuTestSuite } from '../src/examples';

testRunner(accountMenuTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
