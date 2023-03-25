import { goto, playwrightGetTestEngine, playWrightTestAdapter } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { complexButtonTestSuite, iconAndLabelButtonTestSuite } from '../src/examples';

testRunner(iconAndLabelButtonTestSuite, playWrightTestAdapter, {
  // @ts-ignore
  goto,
  getTestEngine: playwrightGetTestEngine,
});

testRunner(complexButtonTestSuite, playWrightTestAdapter, {
  // @ts-ignore
  goto,
  getTestEngine: playwrightGetTestEngine,
});
