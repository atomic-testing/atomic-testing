import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { sliderExampleTestSuite } from '../src/examples';

testRunner(sliderExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
