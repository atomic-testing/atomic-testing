import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { simpleTreeViewTestSuite } from '../src/examples';

testRunner(simpleTreeViewTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
