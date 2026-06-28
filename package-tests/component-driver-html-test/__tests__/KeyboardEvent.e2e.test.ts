import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { keyboardEventExampleTestSuite } from '../src/examples';

testRunner(keyboardEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
