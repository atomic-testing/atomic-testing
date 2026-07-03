import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { avatarExampleTestSuite } from '../src/examples';

testRunner(avatarExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
