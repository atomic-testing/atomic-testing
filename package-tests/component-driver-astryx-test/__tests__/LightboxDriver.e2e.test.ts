import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { lightboxExampleTestSuite } from '../src/examples';

testRunner(lightboxExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
