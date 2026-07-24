import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { PopoverDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

const firstContentPart = {
  close: {
    locator: byDataTestId('first-close'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

const secondContentPart = {
  close: {
    locator: byDataTestId('second-close'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

export const popoverScenePart = {
  // PopoverDriver is anchored at the TRIGGER (not the content) — see its class
  // doc comment for why: PopoverContent shares role="dialog" with a modal
  // DialogContent, so the driver derives the portalled content locator from
  // this trigger's aria-controls at call time instead of a static portal re-root.
  first: {
    locator: byDataTestId('first-trigger'),
    driver: PopoverDriver<typeof firstContentPart>,
    option: {
      content: firstContentPart,
    },
  },
  second: {
    locator: byDataTestId('second-trigger'),
    driver: PopoverDriver<typeof secondContentPart>,
    option: {
      content: secondContentPart,
    },
  },
} satisfies ScenePart;

export const popoverTestSuite: TestSuiteInfo<typeof popoverScenePart> = {
  title: 'Reka UI Popover',
  url: '/popover',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    describe('Reka UI Popover', () => {
      const engine = useTestEngine(popoverScenePart, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.first.isOpen());
        assertFalse(await engine().parts.second.isOpen());
      });

      test('open() mounts the content and close() unmounts it', async () => {
        await engine().parts.first.open();
        await engine().parts.first.waitForOpen();
        assertTrue(await engine().parts.first.isOpen());

        await engine().parts.first.close();
        await engine().parts.first.waitForClose();
        assertFalse(await engine().parts.first.isOpen());
      });

      // Exercises the aria-controls -> byLinkedElement content resolution: the
      // close button only resolves once open() has populated aria-controls.
      test('the linked content close button closes the popover', async () => {
        await engine().parts.first.open();
        await engine().parts.first.waitForOpen();
        await engine().parts.first.content.close.click();
        await engine().parts.first.waitForClose();
        assertFalse(await engine().parts.first.isOpen());
      });

      test('pressing Escape closes the popover', async () => {
        await engine().parts.first.open();
        await engine().parts.first.waitForOpen();
        const closed = await engine().parts.first.closeByEscape();
        assertTrue(closed);
        assertFalse(await engine().parts.first.isOpen());
      });

      // The two-instance disambiguation this scene exists for: both instances
      // render the same role="dialog" content, so this proves the driver's
      // aria-controls link resolves to THIS trigger's own content, not
      // whichever role="dialog" happens to be open. Sequential rather than
      // simultaneous by necessity, not test laziness: Reka's non-modal
      // PopoverContent (the default, used by this scene) dismisses itself on
      // ANY outside pointerdown — including a click on a SIBLING popover's own
      // trigger, confirmed live — so two independently-triggered popovers can
      // never both be genuinely open at once via ordinary clicks; forcing that
      // would need an artificial onPointerDownOutside.preventDefault() escape
      // hatch this near-mechanical port scene deliberately doesn't add. The
      // meaningful disambiguation proof is that closing/reopening the OTHER
      // instance never leaves this one's `isOpen()` reading a stale/borrowed
      // `true` from the shared role="dialog".
      test('opening one popover does not affect the other', async () => {
        await engine().parts.first.open();
        await engine().parts.first.waitForOpen();

        assertTrue(await engine().parts.first.isOpen());
        assertFalse(await engine().parts.second.isOpen());

        await engine().parts.first.close();
        await engine().parts.first.waitForClose();

        await engine().parts.second.open();
        await engine().parts.second.waitForOpen();

        assertTrue(await engine().parts.second.isOpen());
        assertFalse(await engine().parts.first.isOpen());
      });
    });
  },
};
