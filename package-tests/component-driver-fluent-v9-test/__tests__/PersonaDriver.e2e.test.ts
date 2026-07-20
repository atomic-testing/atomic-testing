import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { personaExampleTestSuite } from '../src/examples';

testRunner(personaExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
