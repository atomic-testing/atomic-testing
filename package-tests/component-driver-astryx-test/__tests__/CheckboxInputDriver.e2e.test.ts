import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { checkboxInputExampleTestSuite } from '../src/examples';

testRunner(checkboxInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
