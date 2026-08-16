import { Carousel } from '@astryxdesign/core/Carousel';
import { Tooltip } from '@astryxdesign/core/Tooltip';
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
 *
 * One slide hosts a `Tooltip` on purpose. Astryx 0.4.2 drops an inert
 * `<template>` marker wherever a context layer sits, and those markers land
 * amongst real content — so a scene with no layer in it cannot tell whether the
 * item count is counting slides or slides-plus-markers.
 */
export const CarouselExample = () => (
  <>
    <Carousel data-testid='gallery' aria-label='Photos'>
      <div>Slide 1</div>
      <div>
        <Tooltip label='The second one'>
          <button type='button'>Slide 2</button>
        </Tooltip>
      </div>
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
