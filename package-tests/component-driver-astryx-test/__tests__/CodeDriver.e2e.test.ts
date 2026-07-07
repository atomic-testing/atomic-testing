import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { codeExampleTestSuite } from '../src/examples';

testRunner(codeExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
