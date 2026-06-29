import { Carousel } from '@astryxdesign/core/Carousel';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Carousel scene.
 *
 * Carousel self-emits `data-testid` on the root `<div role="region">` (labelled by
 * `aria-label`); the first child `<div>` is the scroll track whose direct children
 * are the items, and prev/next controls render as `aria-label="Scroll left"`/
 * `"Scroll right"` buttons. Actual scrolling/overflow is layout-driven and only
 * meaningful in the browser; the label and item count read everywhere.
 */
export const CarouselExample = () => (
  <>
    <Carousel data-testid='gallery' aria-label='Photos'>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </Carousel>
    <Carousel data-testid='thumbs' aria-label='Thumbnails'>
      <div>Thumb 1</div>
      <div>Thumb 2</div>
    </Carousel>
  </>
);

export const carouselUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Carousel',
  ui: <CarouselExample />,
};
