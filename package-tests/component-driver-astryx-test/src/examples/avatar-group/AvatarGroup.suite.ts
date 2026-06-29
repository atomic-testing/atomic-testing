import { AvatarGroupDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { avatarGroupUIExample } from './AvatarGroup.examples';

export const avatarGroupExampleScenePart = {
  withOverflow: {
    locator: byDataTestId('avatar-group-overflow'),
    driver: AvatarGroupDriver,
  },
  withoutOverflow: {
    locator: byDataTestId('avatar-group-plain'),
    driver: AvatarGroupDriver,
  },
} satisfies ScenePart;

export const avatarGroupExample: IExampleUnit<typeof avatarGroupExampleScenePart, JSX.Element> = {
  ...avatarGroupUIExample,
  scene: avatarGroupExampleScenePart,
};

export const avatarGroupExampleTestSuite: TestSuiteInfo<typeof avatarGroupExample.scene> = {
  title: 'Astryx AvatarGroup',
  url: '/avatar-group',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${avatarGroupExample.title}`, () => {
      const engine = useTestEngine(avatarGroupExample.scene, getTestEngine, { beforeEach, afterEach });

      // getVisibleCount counts the [role="img"] avatars; getAvatarNames reads their labels.
      test(`getVisibleCount and getAvatarNames read the avatars`, async () => {
        assertEqual(await engine().parts.withOverflow.getVisibleCount(), 3);
        assertEqual(await engine().parts.withOverflow.getAvatarNames(), ['John Doe', 'Jane Smith', 'Sam Lee']);
      });

      // The overflow chip's "{n} more" aria-label yields the hidden count.
      test(`getOverflowCount parses the overflow chip`, async () => {
        assertEqual(await engine().parts.withOverflow.getOverflowCount(), 5);
      });

      // A group without an overflow chip reports undefined and counts only its avatars.
      test(`a group without overflow reports undefined`, async () => {
        assertEqual(await engine().parts.withoutOverflow.getOverflowCount(), undefined);
        assertEqual(await engine().parts.withoutOverflow.getVisibleCount(), 2);
        assertEqual(await engine().parts.withoutOverflow.getAvatarNames(), ['Alice Wong', 'Bob Carter']);
      });
    });
  },
};
