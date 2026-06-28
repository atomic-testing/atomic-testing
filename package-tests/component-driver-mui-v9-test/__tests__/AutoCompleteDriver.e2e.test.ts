import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicAutoCompleteTestSuite } from '../src/examples';

testRunner(basicAutoCompleteTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
