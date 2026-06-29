import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { checkboxListExampleTestSuite } from '../src/examples';

testRunner(checkboxListExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
