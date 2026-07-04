import { AvatarDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { avatarUIExample } from './Avatar.examples';

export const avatarExampleScenePart = {
  jd: {
    locator: byDataTestId('avatar-jd'),
    driver: AvatarDriver,
  },
  ab: {
    locator: byDataTestId('avatar-ab'),
    driver: AvatarDriver,
  },
} satisfies ScenePart;

export const avatarExample: IExampleUnit<typeof avatarExampleScenePart, JSX.Element> = {
  ...avatarUIExample,
  scene: avatarExampleScenePart,
};

export const avatarExampleTestSuite: TestSuiteInfo<typeof avatarExample.scene> = {
  title: 'Radix Avatar',
  url: '/avatar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse }) => {
    describe(`${avatarExample.title}`, () => {
      const engine = useTestEngine(avatarExample.scene, getTestEngine, { beforeEach, afterEach });

      test('renders the fallback and reports no image, per instance', async () => {
        assertFalse(await engine().parts.jd.hasImage());
        assertEqual(await engine().parts.jd.getFallbackText(), 'JD');
        assertEqual(await engine().parts.jd.getAltText(), undefined);

        assertFalse(await engine().parts.ab.hasImage());
        assertEqual(await engine().parts.ab.getFallbackText(), 'AB');
      });
    });
  },
};
