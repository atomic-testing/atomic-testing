import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';

import { basicSliderTestSuite } from '../src/examples';

testRunner(basicSliderTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
