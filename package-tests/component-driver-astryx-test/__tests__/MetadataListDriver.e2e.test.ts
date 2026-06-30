import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { metadataListExampleTestSuite } from '../src/examples';

testRunner(metadataListExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
