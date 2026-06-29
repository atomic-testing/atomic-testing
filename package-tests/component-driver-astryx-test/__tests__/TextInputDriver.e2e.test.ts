import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { textInputExampleTestSuite } from '../src/examples';

testRunner(textInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
