import { CarouselDriver } from '@atomic-testing/component-driver-fluent-v9';
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
  title: 'Fluent Carousel',
  url: '/carousel',
  tests: (
    getTestEngine,
    { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse, hasLayout }
  ) => {
    describe(`${carouselExample.title}`, () => {
      const engine = useTestEngine(carouselExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel reads the region's aria-label; the two carousels stay independent.
      test('reads the carousel label', async () => {
        assertEqual(await engine().parts.gallery.getLabel(), 'Photos');
        assertEqual(await engine().parts.thumbs.getLabel(), 'Thumbnails');
      });

      // Card enumeration/text is plain DOM structure, portable to both environments.
      test('counts and reads the cards', async () => {
        assertEqual(await engine().parts.gallery.getCardCount(), 3);
        assertEqual(await engine().parts.thumbs.getCardCount(), 2);

        const cards = await engine().parts.gallery.getCards();
        assertEqual(cards.length, 3);
        assertEqual(await cards[0]?.getText(), 'Slide one');
        assertEqual(await cards[2]?.getText(), 'Slide three');
      });

      test('getCardByIndex resolves a card, or null when out of range', async () => {
        const card = await engine().parts.gallery.getCardByIndex(1);
        assertEqual(await card?.getText(), 'Slide two');
        assertEqual(await engine().parts.gallery.getCardByIndex(99), null);
      });

      // The CarouselNav container itself mounts under jsdom regardless of
      // embla-carousel's degenerate snap-group computation — only its
      // CHILDREN (nav button count/selection) are E2E-only. See
      // CarouselNavDriver's class doc.
      test('getNav resolves the mounted CarouselNav', async () => {
        const nav = await engine().parts.gallery.getNav();
        assertTrue(nav != null);
      });

      // E2E-only: navigation and active-slide state are driven by
      // embla-carousel's real scroll-snap geometry (slidesToScroll grouping,
      // IntersectionObserver visibility) — jsdom has no layout engine, so
      // every configuration collapses to a single snap group there
      // regardless of the real card count (verified: exactly one
      // CarouselNavButton renders for 3 cards under jsdom, and both
      // prev/next CarouselButtons stay permanently disabled). See
      // CarouselDriver/CarouselNavDriver/CarouselCardDriver's class docs.
      if (hasLayout) {
        test('CarouselNav has one nav button per card, the first selected initially', async () => {
          const nav = await engine().parts.gallery.getNav();
          assertEqual(await nav?.getItemCount(), 3);
          assertEqual(await nav?.getActiveIndex(), 0);
        });

        test('selectByIndex on the nav navigates to that card', async () => {
          const nav = await engine().parts.gallery.getNav();
          assertTrue((await nav?.selectByIndex(2)) === true);
          assertEqual(await nav?.getActiveIndex(), 2);
          // Out of range.
          assertFalse((await nav?.selectByIndex(99)) === true);
        });

        test('scrollNext/scrollPrev move the active card, gated at the boundaries', async () => {
          const gallery = engine().parts.gallery;
          assertTrue(await gallery.isPrevDisabled());
          assertFalse(await gallery.isNextDisabled());

          await gallery.scrollNext();
          const nav = await gallery.getNav();
          assertEqual(await nav?.getActiveIndex(), 1);
          assertFalse(await gallery.isPrevDisabled());

          await gallery.scrollPrev();
          assertEqual(await nav?.getActiveIndex(), 0);
          assertTrue(await gallery.isPrevDisabled());
        });

        test('the active card reports isActive; the rest do not', async () => {
          const cards = await engine().parts.gallery.getCards();
          assertTrue(await cards[0]!.isActive());
          assertFalse(await cards[1]!.isActive());
          assertFalse(await cards[2]!.isActive());
        });
      }
    });
  },
};
