import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { appShellExampleTestSuite } from '../src/examples';

testRunner(appShellExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
