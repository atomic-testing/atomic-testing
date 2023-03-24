import { goto, playwrightGetTestEngine, playWrightTestAdapter } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';
import { complexButtonTestSuite } from '../src/examples/button/Complex.example';
import { iconAndLabelButtonTestSuite } from '../src/examples/button/IconAndLabel.example';

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
