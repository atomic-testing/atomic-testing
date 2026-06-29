import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { textAreaExampleTestSuite } from '../src/examples';

testRunner(textAreaExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
