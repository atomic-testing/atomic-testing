import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { dropdownMenuTestSuite } from '../src/examples/dropdown-menu/DropdownMenu.suite';

testRunner(dropdownMenuTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
