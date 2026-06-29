import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { citationExampleTestSuite } from '../src/examples';

testRunner(citationExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
