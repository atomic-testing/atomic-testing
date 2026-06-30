import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicStepperTestSuite } from '../src/examples';

testRunner(basicStepperTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
