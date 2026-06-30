import { byDataTestId, ScenePart } from '@atomic-testing/core';

import { AppDataTestId } from '../AppDataTestId';
import { TicketConsoleDriver } from '../components/ticketConsole/TicketConsoleDriver';

// The single scene shared by BOTH the Vitest DOM tests and the Playwright E2E specs. The only thing
// that differs between the two runs is how the TestEngine is constructed (React render vs. a browser
// page) — this `parts` map and the drivers it wires are imported, unchanged, by both.
export const consoleParts = {
  console: {
    locator: byDataTestId(AppDataTestId.console),
    driver: TicketConsoleDriver,
  },
} satisfies ScenePart;
