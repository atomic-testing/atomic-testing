import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { radioButtonTestSuite } from '../src/examples/radio-button/RadioButton.suite';

testRunner(radioButtonTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
