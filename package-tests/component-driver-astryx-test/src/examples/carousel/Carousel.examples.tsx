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
 * One slide hosts a `Tooltip` on purpose, so the scene contains one of the inert
 * `<template>` layer markers Astryx 0.4.2 emits. Note where it actually lands:
 * Carousel wraps every child in its own `role="group"` slide, so the marker ends up
 * *inside* a slide rather than beside them, and the item count cannot be displaced
 * by it. That makes the count's `[role="group"]` selector defensive rather than a
 * fix for an observable bug — what this scene pins is that a layer nested in a slide
 * does not confuse the count, which is the realistic case a consumer creates.
 */
export const CarouselExample = () => (
  <>
    <Carousel data-testid='gallery' aria-label='Photos'>
      <div>Slide 1</div>
      <div>
        <Tooltip content='The second one'>
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
