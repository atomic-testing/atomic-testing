import { EmptyState } from '@astryxdesign/core/EmptyState';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx EmptyState scene.
 *
 * EmptyState renders a `<div role="status">` (where `data-testid` is forwarded)
 * around a heading, a `<p>` description, and — when `actions` are given — a
 * trailing button. The `basic` instance omits actions and uses the default `<h3>`;
 * the `withAction` instance sets `headingLevel={2}` and supplies an action button.
 */
export const EmptyStateExample = () => (
  <div>
    <EmptyState
      title='No results found'
      description='Try adjusting your search or filters.'
      data-testid='empty-basic'
    />
    <EmptyState
      title='Your inbox is empty'
      description='Start a conversation to see it here.'
      headingLevel={2}
      actions={<button>Compose</button>}
      data-testid='empty-with-action'
    />
  </div>
);

export const emptyStateUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx EmptyState',
  ui: <EmptyStateExample />,
};
