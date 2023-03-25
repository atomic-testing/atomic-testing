import { goto, playwrightGetTestEngine, playWrightTestAdapter } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { iconCheckboxTestSuite, indeterminateCheckboxTestSuite, labelCheckboxTestSuite } from '../src/examples';

testRunner(labelCheckboxTestSuite, playWrightTestAdapter, {
  // @ts-ignore
  goto,
  getTestEngine: playwrightGetTestEngine,
});

testRunner(iconCheckboxTestSuite, playWrightTestAdapter, {
  // @ts-ignore
  goto,
  getTestEngine: playwrightGetTestEngine,
});

testRunner(indeterminateCheckboxTestSuite, playWrightTestAdapter, {
  // @ts-ignore
  goto,
  getTestEngine: playwrightGetTestEngine,
});
