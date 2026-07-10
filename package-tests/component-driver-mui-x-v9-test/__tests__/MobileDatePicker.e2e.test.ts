import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { mobileDatePickerTestSuite } from '../src/examples';

testRunner(mobileDatePickerTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
