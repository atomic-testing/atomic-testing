import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { markdownExampleTestSuite } from '../src/examples';

testRunner(markdownExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
