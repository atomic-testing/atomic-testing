import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { swatchPickerExampleTestSuite } from '../src/examples';

testRunner(swatchPickerExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
