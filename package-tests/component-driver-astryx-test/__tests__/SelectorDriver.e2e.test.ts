import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { selectorExampleTestSuite } from '../src/examples';

testRunner(selectorExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
