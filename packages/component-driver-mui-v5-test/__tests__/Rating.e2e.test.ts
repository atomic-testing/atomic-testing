import { testRunner } from '@atomic-testing/core';
import { ratingTestSuite } from '../src/examples/rating';
import { playwrightGetTestEngine, playWrightTestAdapter } from './playWrightTestAdapter';

// @ts-ignore
testRunner(ratingTestSuite, playWrightTestAdapter, playwrightGetTestEngine);
