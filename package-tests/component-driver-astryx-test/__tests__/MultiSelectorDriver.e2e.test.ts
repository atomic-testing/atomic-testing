import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { multiSelectorExampleTestSuite } from '../src/examples';

testRunner(multiSelectorExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
