import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { selectableListTestSuite } from '../src/examples';

testRunner(selectableListTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
