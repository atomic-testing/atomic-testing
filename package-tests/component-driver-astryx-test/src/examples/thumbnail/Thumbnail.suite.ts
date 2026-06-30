import { ThumbnailDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { thumbnailUIExample } from './Thumbnail.examples';

export const thumbnailExampleScenePart = {
  placeholder: {
    locator: byDataTestId('thumbnail-placeholder'),
    driver: ThumbnailDriver,
  },
  image: {
    locator: byDataTestId('thumbnail-image'),
    driver: ThumbnailDriver,
  },
  removable: {
    locator: byDataTestId('thumbnail-removable'),
    driver: ThumbnailDriver,
  },
  loading: {
    locator: byDataTestId('thumbnail-loading'),
    driver: ThumbnailDriver,
  },
} satisfies ScenePart;

export const thumbnailExample: IExampleUnit<typeof thumbnailExampleScenePart, JSX.Element> = {
  ...thumbnailUIExample,
  scene: thumbnailExampleScenePart,
};

export const thumbnailExampleTestSuite: TestSuiteInfo<typeof thumbnailExample.scene> = {
  title: 'Astryx Thumbnail',
  url: '/thumbnail',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${thumbnailExample.title}`, () => {
      const engine = useTestEngine(thumbnailExample.scene, getTestEngine, { beforeEach, afterEach });

      // An image thumbnail exposes its src; getAccessibleName reads the composite aria-label.
      test(`getImageSrc and getAccessibleName read the image thumbnail`, async () => {
        assertEqual(await engine().parts.image.getImageSrc(), 'https://example.com/p.jpg');
        assertEqual(await engine().parts.image.getAccessibleName(), 'photo.jpg — Vacation photo');
      });

      // isLoading is true only for the loading thumbnail (renders a skeleton, no img).
      test(`isLoading detects the loading state`, async () => {
        assertTrue(await engine().parts.loading.isLoading());
        assertEqual(await engine().parts.loading.getImageSrc(), undefined);
        assertFalse(await engine().parts.image.isLoading());
      });

      // isPlaceholder is true only when there is neither an image nor a skeleton.
      test(`isPlaceholder detects the placeholder state`, async () => {
        assertTrue(await engine().parts.placeholder.isPlaceholder());
        assertFalse(await engine().parts.image.isPlaceholder());
        assertFalse(await engine().parts.loading.isPlaceholder());
      });

      // canRemove is true only for the thumbnail with a Remove button.
      test(`canRemove detects the remove control`, async () => {
        assertTrue(await engine().parts.removable.canRemove());
        assertFalse(await engine().parts.image.canRemove());
      });
    });
  },
};
