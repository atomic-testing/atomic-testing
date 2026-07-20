import { AvatarDriver, AvatarGroupDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { avatarUIExample } from './Avatar.examples';

export const avatarExampleScenePart = {
  plain: { locator: byDataTestId('avatar-plain'), driver: AvatarDriver },
  withBadge: { locator: byDataTestId('avatar-with-badge'), driver: AvatarDriver },
  group: { locator: byDataTestId('avatar-group'), driver: AvatarGroupDriver },
} satisfies ScenePart;

export const avatarExample: IExampleUnit<typeof avatarExampleScenePart, JSX.Element> = {
  ...avatarUIExample,
  scene: avatarExampleScenePart,
};

export const avatarExampleTestSuite: TestSuiteInfo<typeof avatarExample.scene> = {
  title: 'Fluent Avatar',
  url: '/avatar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${avatarExample.title}`, () => {
      const engine = useTestEngine(avatarExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its own name and initials, with no presence badge by default', async () => {
        assertEqual(await engine().parts.plain.getName(), 'Kevin Sturgis');
        assertEqual(await engine().parts.plain.getInitials(), 'KS');
        assertFalse(await engine().parts.plain.getPresenceBadge().exists());
      });

      test('exposes a nested presence badge when one is supplied', async () => {
        assertTrue(await engine().parts.withBadge.getPresenceBadge().exists());
        assertEqual(await engine().parts.withBadge.getPresenceBadge().getStatusLabel(), 'busy');
      });

      test('AvatarGroup enumerates its inline items in DOM order', async () => {
        assertEqual(await engine().parts.group.getItemCount(), 2);
        assertEqual(await engine().parts.group.getNames(), ['Person One', 'Person Two']);
        const first = await engine().parts.group.getItemByIndex(0);
        assertEqual(await first?.getAvatar().getName(), 'Person One');
      });
    });
  },
};
