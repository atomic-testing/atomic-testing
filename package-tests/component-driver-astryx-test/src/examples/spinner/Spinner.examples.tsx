import { Spinner } from '@astryxdesign/core/Spinner';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Spinner scene.
 *
 * Spinner's structure is conditional: unlabeled, the root IS the
 * `<span role="status" aria-label>` (default name `"Loading"`); labeled, the root
 * is a roleless `<div>` wrapping the status span plus a visible `astryx-text`
 * label. The two instances cover both shapes.
 */
export const SpinnerExample = () => (
  <div>
    <Spinner data-testid='spinner-unlabeled' />
    <Spinner label='Loading...' data-testid='spinner-labeled' />
  </div>
);

export const spinnerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Spinner',
  ui: <SpinnerExample />,
};
