import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { tagPickerExampleTestSuite } from '../src/examples';

testRunner(tagPickerExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
