import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { geometryExampleTestSuite } from '../src/examples';

testRunner(geometryExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
