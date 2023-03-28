import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { alertDialogTestSuite } from '../src/examples/dialog/AlertDialog.examples';

testRunner(alertDialogTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
