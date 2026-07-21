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
