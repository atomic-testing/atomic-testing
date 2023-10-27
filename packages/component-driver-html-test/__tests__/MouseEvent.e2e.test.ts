import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { clickLocationMouseEventExampleTestSuite, hoverMouseEventExampleTestSuite } from '../src/examples';

testRunner(hoverMouseEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
testRunner(clickLocationMouseEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
