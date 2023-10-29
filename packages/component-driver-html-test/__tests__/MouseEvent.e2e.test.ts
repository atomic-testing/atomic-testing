import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import {
  clickLocationMouseEventExampleTestSuite,
  hoverMouseEventExampleTestSuite,
  mouseLocationMouseEventExampleTestSuite,
} from '../src/examples';

testRunner(hoverMouseEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
testRunner(clickLocationMouseEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
testRunner(mouseLocationMouseEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
