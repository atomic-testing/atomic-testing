import { AvatarDriver, AvatarGroupDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicAvatarUIExample } from './BasicAvatar.example';

export const basicAvatarExampleScenePart = {
  letter: {
    locator: byDataTestId('letter-avatar'),
    driver: AvatarDriver,
  },
  image: {
    locator: byDataTestId('image-avatar'),
    driver: AvatarDriver,
  },
  group: {
    locator: byDataTestId('avatar-group'),
    driver: AvatarGroupDriver,
  },
} satisfies ScenePart;

export const basicAvatarExample: IExampleUnit<typeof basicAvatarExampleScenePart, JSX.Element> = {
  ...basicAvatarUIExample,
  scene: basicAvatarExampleScenePart,
};

export const basicAvatarTestSuite: TestSuiteInfo<typeof basicAvatarExampleScenePart> = {
  title: 'Basic Avatar',
  url: '/avatar',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicAvatarExample.scene, getTestEngine, { beforeEach, afterEach });

    test('reads a letter avatar', async () => {
      assertEqual(await engine().parts.letter.getInitials(), 'OP');
      assertFalse(await engine().parts.letter.hasImage());
      assertEqual(await engine().parts.letter.getAltText(), undefined);
    });

    test('reads an image avatar', async () => {
      assertTrue(await engine().parts.image.hasImage());
      assertEqual(await engine().parts.image.getAltText(), 'Remy Sharp');
      assertEqual(await engine().parts.image.getInitials(), undefined);
    });

    test('reports the visible count and surplus of a group', async () => {
      assertEqual(await engine().parts.group.getVisibleCount(), 2);
      assertEqual(await engine().parts.group.getSurplusLabel(), '+3');
    });

    test('exposes group avatars as item drivers', async () => {
      const items = await engine().parts.group.getItems();
      assertEqual(items.length, 3);
    });
  },
};
