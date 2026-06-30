import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { selectableCardExampleTestSuite } from '../src/examples';

testRunner(selectableCardExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
