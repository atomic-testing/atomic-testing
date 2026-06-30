import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import {
  clickLocationMouseEventExampleTestSuite,
  hoverMouseEventExampleTestSuite,
  mouseLocationMouseEventExampleTestSuite,
  mouseOverMouseEventExampleTestSuite,
} from '../src/examples';

testRunner(hoverMouseEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
testRunner(clickLocationMouseEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
testRunner(mouseLocationMouseEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
testRunner(mouseOverMouseEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
