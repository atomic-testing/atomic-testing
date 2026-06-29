import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { thumbnailExampleTestSuite } from '../src/examples';

testRunner(thumbnailExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
