import { testRunner } from '@atomic-testing/core';
import { goto, playwrightGetTestEngine, playWrightTestAdapter } from '@atomic-testing/playwright';
import { ratingTestSuite } from '../src/examples/rating';

testRunner(ratingTestSuite, playWrightTestAdapter, {
  // @ts-ignore
  goto,
  getTestEngine: playwrightGetTestEngine,
});
