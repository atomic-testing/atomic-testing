import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX } from 'react';

/**
 * Astryx MetadataList scene.
 *
 * MetadataList self-emits `data-testid` on the root `<div>` and renders entries as
 * a `<dl>` of `<dt>`/`<dd>` pairs. The `details` list is static; the `release`
 * list sets `maxNumOfItems` so the extra entries are collapsed (not rendered) until
 * the "Show more" toggle expands them.
 */
export const MetadataListExample = () => (
  <>
    <MetadataList title='Details' data-testid='details'>
      <MetadataListItem label='Status'>Active</MetadataListItem>
      <MetadataListItem label='Owner'>Alice</MetadataListItem>
      <MetadataListItem label='Total'>$42.00</MetadataListItem>
    </MetadataList>
    <MetadataList title='Release' maxNumOfItems={2} data-testid='release'>
      <MetadataListItem label='Version'>1.0.0</MetadataListItem>
      <MetadataListItem label='Channel'>stable</MetadataListItem>
      <MetadataListItem label='Size'>2.4 MB</MetadataListItem>
      <MetadataListItem label='License'>MIT</MetadataListItem>
    </MetadataList>
  </>
);

export const metadataListUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx MetadataList',
  ui: <MetadataListExample />,
};
