import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicStepperTestSuite } from '../src/examples';

testRunner(basicStepperTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
