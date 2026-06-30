import { Timestamp } from '@astryxdesign/core/Timestamp';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Timestamp scene.
 *
 * Timestamp wraps an inner `<time datetime>` (which receives the forwarded
 * `data-testid`) in an outer `<span>` carrying `data-format`. The two instances
 * use distinct `format` values so the format-bearing wrapper of each is uniquely
 * addressable via `data-format`, while the `<time>` is reached by `data-testid`.
 */
export const TimestampExample = () => (
  <div>
    <Timestamp value='2026-02-19T17:00:00.000Z' format='date' data-testid='timestamp-date' />
    <Timestamp value='2026-02-19T17:00:00.000Z' format='system_date' data-testid='timestamp-system' />
  </div>
);

export const timestampUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Timestamp',
  ui: <TimestampExample />,
};
