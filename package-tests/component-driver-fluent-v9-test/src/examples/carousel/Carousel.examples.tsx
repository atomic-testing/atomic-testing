import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Carousel,
  CarouselButton,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
  CarouselSlider,
  CarouselViewport,
  FluentProvider,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

/**
 * `Carousel`'s underlying scroll engine (`embla-carousel@8.6.0`, wrapped by
 * `@fluentui/react-carousel@9.9.10`'s `useEmblaCarousel`) unconditionally
 * reaches for `window.matchMedia` (`OptionsHandler.optionsMediaQueries` —
 * even with no `breakpoints` configured, an empty-array
 * `.map(ownerWindow.matchMedia)` still throws a `TypeError` if `matchMedia`
 * isn't callable at all, since `Array.prototype.map` validates its callback
 * before checking array length) and `IntersectionObserver`
 * (`SlidesInView`, which toggles each `CarouselCard`'s `aria-hidden`/`inert`)
 * during its FIRST activation effect — which fires the instant the
 * container ref attaches, i.e. on every mount, not only when a consumer
 * opts into responsive breakpoints or visibility tracking.
 *
 * jsdom implements neither global at all: rendering a real `Carousel` under
 * jsdom without these throws before any test assertion runs (confirmed) — a
 * harder failure than the already-documented, gracefully-degrading
 * `ResizeObserver`/`MessageBar` gap in this test package's `jest.setup.ts`
 * (which `Carousel` also needs, for the same activation path).
 *
 * These guarded, inert stubs (no synthetic media/intersection/resize events
 * ever fire) are scoped to this example file rather than the shared
 * `jest.setup.ts` that `ResizeObserver`'s stub lives in, because this
 * driver's implementation task is restricted to adding NEW files only. A
 * follow-up should hoist all three into `jest.setup.ts` alongside the
 * existing `ResizeObserver` stub for consistency — see the Carousel README
 * section's "Known gaps" / this task's deferred-scope note. The `typeof
 * window !== 'undefined'` guard keeps this a no-op when Vite serves this
 * same module to a real browser for e2e (where all three already exist).
 */
if (typeof window !== 'undefined') {
  const browserGlobals = window as unknown as {
    matchMedia?: unknown;
    IntersectionObserver?: unknown;
    ResizeObserver?: unknown;
  };
  if (typeof browserGlobals.matchMedia !== 'function') {
    browserGlobals.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }
  if (typeof browserGlobals.IntersectionObserver !== 'function') {
    browserGlobals.IntersectionObserver = class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
      takeRecords(): unknown[] {
        return [];
      }
    };
  }
  if (typeof browserGlobals.ResizeObserver !== 'function') {
    browserGlobals.ResizeObserver = class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };
  }
}

/**
 * Two `Carousel`s with deliberately different card counts/content so a
 * too-broadly-scoped locator in `CarouselDriver` would be caught immediately
 * (same disambiguation shape as the `Tags`/`Menu` examples). Both set
 * `groupSize={1}` — Fluent's default (`'auto'`) fits as many cards per page
 * as the real viewport allows, which would make the intended
 * one-nav-dot-per-card relationship depend on window width; `groupSize={1}`
 * makes it unambiguous for a real-browser E2E run (jsdom cannot honor
 * either value — see `CarouselDriver`/`CarouselNavDriver`'s class docs).
 *
 * Every `CarouselButton` sets its own `aria-label`: Fluent ships no default
 * accessible name for it at all (DOM/type audit — see `CarouselDriver`'s
 * class doc), so a real, accessible carousel MUST supply one; this example
 * follows that same requirement. Every `CarouselNavButton` sets its own
 * `aria-label` for the identical reason (Fluent renders it as a bare dot,
 * no visible text).
 */
const CarouselExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Carousel aria-label='Photos' data-testid='gallery' groupSize={1}>
      <CarouselViewport>
        <CarouselSlider>
          <CarouselCard>Slide one</CarouselCard>
          <CarouselCard>Slide two</CarouselCard>
          <CarouselCard>Slide three</CarouselCard>
        </CarouselSlider>
      </CarouselViewport>
      <CarouselNav>{index => <CarouselNavButton aria-label={`Go to photo ${index + 1}`} />}</CarouselNav>
      <CarouselButton navType='prev' aria-label='Previous photo' />
      <CarouselButton navType='next' aria-label='Next photo' />
    </Carousel>

    <Carousel aria-label='Thumbnails' data-testid='thumbs' groupSize={1}>
      <CarouselViewport>
        <CarouselSlider>
          <CarouselCard>Thumb one</CarouselCard>
          <CarouselCard>Thumb two</CarouselCard>
        </CarouselSlider>
      </CarouselViewport>
      <CarouselNav>{index => <CarouselNavButton aria-label={`Go to thumbnail ${index + 1}`} />}</CarouselNav>
      <CarouselButton navType='prev' aria-label='Previous thumbnail' />
      <CarouselButton navType='next' aria-label='Next thumbnail' />
    </Carousel>
  </FluentProvider>
);

export const carouselUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Carousel',
  ui: <CarouselExample />,
};
