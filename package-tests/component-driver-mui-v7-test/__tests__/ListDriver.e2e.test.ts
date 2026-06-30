import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { plainListTestSuite, selectableListTestSuite } from '../src/examples';

testRunner(selectableListTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
testRunner(plainListTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
