import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { fileInputExampleTestSuite } from '../src/examples';

testRunner(fileInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
