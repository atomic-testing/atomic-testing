import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { segmentedControlExampleTestSuite } from '../src/examples';

testRunner(segmentedControlExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
