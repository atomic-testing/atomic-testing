import { AvatarDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { avatarImageSrc, avatarUIExample } from './Avatar.examples';

export const avatarExampleScenePart = {
  initials: {
    locator: byDataTestId('avatar-initials'),
    driver: AvatarDriver,
  },
  image: {
    locator: byDataTestId('avatar-image'),
    driver: AvatarDriver,
  },
  icon: {
    locator: byDataTestId('avatar-icon'),
    driver: AvatarDriver,
  },
} satisfies ScenePart;

export const avatarExample: IExampleUnit<typeof avatarExampleScenePart, JSX.Element> = {
  ...avatarUIExample,
  scene: avatarExampleScenePart,
};

export const avatarExampleTestSuite: TestSuiteInfo<typeof avatarExample.scene> = {
  title: 'Astryx Avatar',
  url: '/avatar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${avatarExample.title}`, () => {
      const engine = useTestEngine(avatarExample.scene, getTestEngine, { beforeEach, afterEach });

      // getAccessibleName reads the aria-label (name when no alt, alt when imaged).
      test(`getAccessibleName reads the aria-label`, async () => {
        assertEqual(await engine().parts.initials.getAccessibleName(), 'John Doe');
        assertEqual(await engine().parts.image.getAccessibleName(), 'Jane Smith photo');
      });

      // An image avatar exposes its src and reports hasImage; initials does neither.
      // NOTE: jsdom always materialises the <img> for a src, so hasImage here means
      // "a src was supplied" — the load-failure fallback to initials is E2E-only.
      test(`hasImage and getImageSrc detect the image branch`, async () => {
        assertTrue(await engine().parts.image.hasImage());
        assertEqual(await engine().parts.image.getImageSrc(), avatarImageSrc);
        assertFalse(await engine().parts.initials.hasImage());
        assertEqual(await engine().parts.initials.getImageSrc(), undefined);
      });

      // The initials avatar renders its initials text; the image avatar renders none.
      test(`getInitials reads the initials fallback`, async () => {
        assertEqual(await engine().parts.initials.getInitials(), 'JD');
        assertEqual(await engine().parts.image.getInitials(), undefined);
      });
    });
  },
};
