import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { outlineExampleTestSuite } from '../src/examples';

testRunner(outlineExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
