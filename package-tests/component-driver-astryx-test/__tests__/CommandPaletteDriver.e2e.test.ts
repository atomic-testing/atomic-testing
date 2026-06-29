import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { commandPaletteExampleTestSuite } from '../src/examples';

testRunner(commandPaletteExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
