import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { searchBoxExampleTestSuite } from '../src/examples';

testRunner(searchBoxExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
