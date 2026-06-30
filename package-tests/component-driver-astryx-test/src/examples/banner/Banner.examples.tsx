import { Banner } from '@astryxdesign/core/Banner';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX } from 'react';

/**
 * Astryx Banner scene.
 *
 * Banner forwards `data-testid` onto a root whose `role` is conditional
 * (alert/status); the stable severity is `data-status` on the inner header, which
 * holds the title and description `<p>`s. The dismissable banner shows a close
 * button; the banner with children shows an expand toggle.
 */
export const BannerExample = () => (
  <div>
    <Banner status='info' title='Update available' description='A new version is ready.' data-testid='info-banner' />
    <Banner status='error' title='Save failed' isDismissable data-testid='error-banner' />
    <Banner status='warning' title='Configuration changes' data-testid='expandable-banner'>
      <ul>
        <li>Detail one</li>
      </ul>
    </Banner>
  </div>
);

export const bannerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Banner',
  ui: <BannerExample />,
};
