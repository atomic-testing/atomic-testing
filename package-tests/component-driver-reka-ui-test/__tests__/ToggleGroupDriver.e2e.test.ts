import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { toggleGroupTestSuite } from '../src/examples/toggle-group/ToggleGroup.suite';

testRunner(toggleGroupTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
