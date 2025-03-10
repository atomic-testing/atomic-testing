import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { ratingTestSuite } from '../src/examples';

testRunner(ratingTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
