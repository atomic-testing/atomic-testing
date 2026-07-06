import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { inputTextTestSuite } from '../src/examples/input-text/InputText.suite';

testRunner(inputTextTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
