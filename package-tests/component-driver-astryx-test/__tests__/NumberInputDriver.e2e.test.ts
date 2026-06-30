import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { numberInputExampleTestSuite } from '../src/examples';

testRunner(numberInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
