import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/internal-test-runner-playwright-adapter';

import { itemExampleTestSuite } from '../src/examples';

testRunner(itemExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
