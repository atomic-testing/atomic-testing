import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { collapsibleExampleTestSuite } from '../src/examples';

testRunner(collapsibleExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
