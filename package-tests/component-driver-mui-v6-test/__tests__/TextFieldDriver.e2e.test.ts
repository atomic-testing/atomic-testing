import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import {
  basicTextFieldTestSuite,
  dateTextFieldTestSuite,
  multilineTextFieldTestSuite,
  readonlyAndDisabledTextFieldTestSuite,
  selectTextFieldTestSuite,
} from '../src/examples';

testRunner(basicTextFieldTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(dateTextFieldTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(multilineTextFieldTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(selectTextFieldTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(readonlyAndDisabledTextFieldTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
