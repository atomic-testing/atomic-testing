import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { infoLabelExampleTestSuite } from '../src/examples';

testRunner(infoLabelExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
