import { testRunner } from '@atomic-testing/core';
import { ratingTestSuite } from '../src/examples/rating';
import { jestTestAdapter } from './jestTestAdapter';

testRunner(ratingTestSuite, jestTestAdapter);
