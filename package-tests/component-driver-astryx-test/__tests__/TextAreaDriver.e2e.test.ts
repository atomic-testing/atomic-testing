import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { textAreaExampleTestSuite } from '../src/examples';

testRunner(textAreaExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
