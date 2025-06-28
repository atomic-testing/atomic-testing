import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { complexButtonTestSuite, iconAndLabelButtonTestSuite } from '../src/examples';

testRunner(iconAndLabelButtonTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(complexButtonTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
