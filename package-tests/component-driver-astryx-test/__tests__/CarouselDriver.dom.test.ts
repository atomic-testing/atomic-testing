import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/react-19';

import { carouselExample, carouselExampleTestSuite } from '../src/examples';

testRunner(carouselExampleTestSuite, jestTestAdapter, {
  getTestEngine: (scenePart: typeof carouselExample.scene) => {
    return createTestEngine(carouselExample.ui, scenePart);
  },
});
