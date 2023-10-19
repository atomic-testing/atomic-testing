import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { hoverMouseEventExampleTestSuite } from '../src/examples';

testRunner(hoverMouseEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
