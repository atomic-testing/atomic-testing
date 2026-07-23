import { LightboxDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { lightboxUIExample } from './Lightbox.examples';

export const lightboxExampleScenePart = {
  openGalleryButton: { locator: byDataTestId('open-gallery-lightbox'), driver: HTMLElementDriver },
  galleryLightbox: { locator: byDataTestId('gallery-lightbox'), driver: LightboxDriver },
  openSingleButton: { locator: byDataTestId('open-single-lightbox'), driver: HTMLElementDriver },
  singleLightbox: { locator: byDataTestId('single-lightbox'), driver: LightboxDriver },
} satisfies ScenePart;

export const lightboxExample: IExampleUnit<typeof lightboxExampleScenePart, JSX.Element> = {
  ...lightboxUIExample,
  scene: lightboxExampleScenePart,
};

// zoom()/pan() are E2E-only (real double-click timing / drag geometry jsdom
// cannot provide — see the driver's JSDoc) and, like CarouselDriver's
// scrollNext/scrollPrev and SliderDriver's pointer-drag, are intentionally not
// exercised here.
export const lightboxExampleTestSuite: TestSuiteInfo<typeof lightboxExample.scene> = {
  title: 'Astryx Lightbox',
  url: '/lightbox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${lightboxExample.title}`, () => {
      const engine = useTestEngine(lightboxExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`opens via the trigger and reports isOpen`, async () => {
        assertFalse(await engine().parts.galleryLightbox.isOpen());
        await engine().parts.openGalleryButton.click();
        assertTrue(await engine().parts.galleryLightbox.waitForOpen(2000));
      });

      test(`starts on the first item: counter, caption, alt, and nav boundaries`, async () => {
        await engine().parts.openGalleryButton.click();
        await engine().parts.galleryLightbox.waitForOpen(2000);
        assertEqual(await engine().parts.galleryLightbox.getCounter(), '1 / 3');
        assertEqual(await engine().parts.galleryLightbox.getCaption(), 'Caption A');
        assertEqual(await engine().parts.galleryLightbox.getCurrentAlt(), 'Photo A');
        assertFalse(await engine().parts.galleryLightbox.canPrev());
        assertTrue(await engine().parts.galleryLightbox.canNext());
      });

      test(`next/prev navigate the gallery and update counter/caption/alt`, async () => {
        await engine().parts.openGalleryButton.click();
        await engine().parts.galleryLightbox.waitForOpen(2000);
        await engine().parts.galleryLightbox.next();
        assertEqual(await engine().parts.galleryLightbox.getCounter(), '2 / 3');
        assertEqual(await engine().parts.galleryLightbox.getCaption(), 'Caption B');
        assertEqual(await engine().parts.galleryLightbox.getCurrentAlt(), 'Photo B');
        await engine().parts.galleryLightbox.prev();
        assertEqual(await engine().parts.galleryLightbox.getCounter(), '1 / 3');
      });

      test(`canNext/canPrev flip at the last item, whose caption is absent`, async () => {
        await engine().parts.openGalleryButton.click();
        await engine().parts.galleryLightbox.waitForOpen(2000);
        await engine().parts.galleryLightbox.next();
        await engine().parts.galleryLightbox.next();
        assertEqual(await engine().parts.galleryLightbox.getCounter(), '3 / 3');
        assertFalse(await engine().parts.galleryLightbox.canNext());
        assertTrue(await engine().parts.galleryLightbox.canPrev());
        assertEqual(await engine().parts.galleryLightbox.getCaption(), undefined);
      });

      test(`close dismisses the lightbox via the close button`, async () => {
        await engine().parts.openGalleryButton.click();
        await engine().parts.galleryLightbox.waitForOpen(2000);
        assertTrue(await engine().parts.galleryLightbox.close(2000));
        assertFalse(await engine().parts.galleryLightbox.isOpen());
      });

      test(`outside gallery mode: no counter, no caption, no nav, alt still reads`, async () => {
        await engine().parts.openSingleButton.click();
        assertTrue(await engine().parts.singleLightbox.waitForOpen(2000));
        assertEqual(await engine().parts.singleLightbox.getCounter(), undefined);
        assertEqual(await engine().parts.singleLightbox.getCaption(), undefined);
        assertEqual(await engine().parts.singleLightbox.getCurrentAlt(), 'Solo photo');
        assertFalse(await engine().parts.singleLightbox.canPrev());
        assertFalse(await engine().parts.singleLightbox.canNext());
      });
    });
  },
};
