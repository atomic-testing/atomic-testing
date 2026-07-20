import { PersonaDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { personaUIExample } from './Persona.examples';

export const personaExampleScenePart = {
  plain: { locator: byDataTestId('persona-plain'), driver: PersonaDriver },
  presenceOnly: { locator: byDataTestId('persona-presence-only'), driver: PersonaDriver },
} satisfies ScenePart;

export const personaExample: IExampleUnit<typeof personaExampleScenePart, JSX.Element> = {
  ...personaUIExample,
  scene: personaExampleScenePart,
};

export const personaExampleTestSuite: TestSuiteInfo<typeof personaExample.scene> = {
  title: 'Fluent Persona',
  url: '/persona',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    describe(`${personaExample.title}`, () => {
      const engine = useTestEngine(personaExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its text lines and nested avatar/presence', async () => {
        assertEqual(await engine().parts.plain.getPrimaryText(), 'Kevin Sturgis');
        assertEqual(await engine().parts.plain.getSecondaryText(), 'Software Engineer');
        assertEqual(await engine().parts.plain.getAvatar().getInitials(), 'KS');
        assertTrue(await engine().parts.plain.getAvatar().getPresenceBadge().exists());
      });

      test('presenceOnly renders the standalone presence badge instead of the avatar', async () => {
        assertTrue(await engine().parts.presenceOnly.getPresenceBadge().exists());
        assertEqual(await engine().parts.presenceOnly.getPresenceBadge().getStatusLabel(), 'busy');
      });
    });
  },
};
