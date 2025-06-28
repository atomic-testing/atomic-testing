import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicSliderTestSuite } from '../src/examples';

testRunner(basicSliderTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
