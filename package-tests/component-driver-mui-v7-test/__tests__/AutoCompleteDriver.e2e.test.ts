import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/internal-test-runner';

import { basicAutoCompleteTestSuite } from '../src/examples';

testRunner(basicAutoCompleteTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
