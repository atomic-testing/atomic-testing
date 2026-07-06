import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { menuTestSuite } from '../src/examples/menu/Menu.suite';

testRunner(menuTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
