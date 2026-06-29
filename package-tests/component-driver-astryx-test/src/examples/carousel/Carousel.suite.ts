import { CarouselDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { carouselUIExample } from './Carousel.examples';

export const carouselExampleScenePart = {
  gallery: {
    locator: byDataTestId('gallery'),
    driver: CarouselDriver,
  },
  thumbs: {
    locator: byDataTestId('thumbs'),
    driver: CarouselDriver,
  },
} satisfies ScenePart;

export const carouselExample: IExampleUnit<typeof carouselExampleScenePart, JSX.Element> = {
  ...carouselUIExample,
  scene: carouselExampleScenePart,
};

export const carouselExampleTestSuite: TestSuiteInfo<typeof carouselExample.scene> = {
  title: 'Astryx Carousel',
  url: '/carousel',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    describe(`${carouselExample.title}`, () => {
      const engine = useTestEngine(carouselExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel reads the region's aria-label; the two carousels stay independent.
      test(`reads the carousel label`, async () => {
        assertEqual(await engine().parts.gallery.getLabel(), 'Photos');
        assertEqual(await engine().parts.thumbs.getLabel(), 'Thumbnails');
      });

      // getItemCount counts the items in each scroll track.
      test(`counts the items`, async () => {
        assertEqual(await engine().parts.gallery.getItemCount(), 3);
        assertEqual(await engine().parts.thumbs.getItemCount(), 2);
      });

      // The prev/next controls are mounted (overflow gates only their visibility, which is E2E-only).
      test(`exposes the navigation controls`, async () => {
        assertTrue(await engine().parts.gallery.hasNavButtons());
      });
    });
  },
};
