import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';

import { basicSelectTestSuite, nativeSelectTestSuite } from '../src/examples';

testRunner(basicSelectTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(nativeSelectTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
