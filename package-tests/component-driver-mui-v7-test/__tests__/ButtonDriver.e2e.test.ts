import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/internal-test-runner';

import { complexButtonTestSuite, iconAndLabelButtonTestSuite } from '../src/examples';

testRunner(iconAndLabelButtonTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(complexButtonTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
