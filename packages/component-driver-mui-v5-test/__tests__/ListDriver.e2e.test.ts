import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { selectableListTestSuite } from '../src/examples';

testRunner(selectableListTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
