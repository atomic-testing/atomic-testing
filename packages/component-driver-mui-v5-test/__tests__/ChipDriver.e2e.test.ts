import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { basicChipTestSuite, clickableChipTestSuite, deletableChipTestSuite } from '../src/examples';

testRunner(basicChipTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(clickableChipTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(deletableChipTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
