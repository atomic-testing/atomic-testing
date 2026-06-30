import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { checkboxGroupTestSuite, singleCheckboxTestSuite } from '../src/examples';

testRunner(singleCheckboxTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(checkboxGroupTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
