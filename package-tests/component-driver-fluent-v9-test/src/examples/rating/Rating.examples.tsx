import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Rating, RatingDisplay, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const RatingExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Rating data-testid='rating-a' name='rating-a' defaultValue={3} />
    <Rating data-testid='rating-b' name='rating-b' defaultValue={1} />
    <Rating data-testid='rating-unset' name='rating-unset' />
    <Rating data-testid='rating-half' name='rating-half' step={0.5} defaultValue={2.5} />
    <fieldset disabled>
      <Rating data-testid='rating-disabled' name='rating-disabled' defaultValue={2} />
    </fieldset>
    <RatingDisplay data-testid='rating-display' value={4.5} count={1234} />
    <RatingDisplay data-testid='rating-display-empty' />
  </FluentProvider>
);

export const ratingUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Rating',
  ui: <RatingExample />,
};
