import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { hoverAnchorExampleTestSuite } from '../src/examples';

testRunner(hoverAnchorExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
