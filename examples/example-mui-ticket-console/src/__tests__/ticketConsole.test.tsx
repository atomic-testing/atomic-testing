import { createTestEngine } from '@atomic-testing/react-19';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { App } from '../App';
import { consoleParts } from '../testing/consoleParts';
import { type Assert, emptyQueueFlow, tabSwitchFlow, triageFlow, validationFlow } from '../testing/scenarios';

// DOM adapter: build the engine by rendering <App/> with React 19. Everything else — the scene and
// the scenario flows — is imported, unchanged, from the same modules the E2E spec uses.
const assert: Assert = {
  equal: (actual, expected, message) => expect(actual, message).toEqual(expected),
  isTrue: (value, message) => expect(value, message).toBe(true),
  match: (actual, pattern, message) => expect(actual ?? '', message).toMatch(pattern),
  includes: (haystack, needle, message) => expect(haystack ?? '', message).toContain(needle),
};

describe('Ticket triage console (DOM)', () => {
  let engine: ReturnType<typeof createTestEngine<typeof consoleParts>>;

  beforeEach(() => {
    engine = createTestEngine(<App />, consoleParts);
  });
  afterEach(() => engine.cleanUp());

  test('triage flow: filter, reassign, save, see it reflected', () => triageFlow(engine.parts.console, assert));
  test('empty state: a queue with no tickets', () => emptyQueueFlow(engine.parts.console, assert));
  test('tab switch: All -> Overdue', () => tabSwitchFlow(engine.parts.console, assert));
  test('validation: clearing the required title blocks save', () => validationFlow(engine.parts.console, assert));
});
