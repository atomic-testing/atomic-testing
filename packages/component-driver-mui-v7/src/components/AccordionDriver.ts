import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
  timingUtil,
} from '@atomic-testing/core';

export const parts = {
  /**
   * The clickable area to expand/collapse the accordion.
   */
  disclosure: {
    locator: byCssClass('MuiAccordionSummary-root'),
    driver: HTMLElementDriver,
  },
  summary: {
    locator: byCssClass('MuiAccordionSummary-content'),
    driver: HTMLElementDriver,
  },
  content: {
    locator: byRole('region'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Driver for Material UI v7 Accordion component.
 * @see https://mui.com/material-ui/react-accordion/
 */
export class AccordionDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
    });
  }

  /**
   * Get the title/summary of the accordion.
   * @returns The title/summary of the accordion.
   */
  async getSummary(): Promise<string | null> {
    const title = await this.parts.summary.getText();
    return title ?? null;
  }

  /**
   * Whether the accordion is expanded.
   * @returns True if the accordion is expanded, false if collapsed.
   */
  async isExpanded(): Promise<boolean> {
    await this.enforcePartExistence('disclosure');
    const expanded = await this.parts.disclosure.getAttribute('aria-expanded');
    return expanded === 'true';
  }

  /**
   * Whether the accordion is disabled.
   * @returns True if the accordion is disabled, false if enabled.
   */
  async isDisabled(): Promise<boolean> {
    await this.enforcePartExistence('disclosure');
    const disabled = await this.parts.disclosure.getAttribute('disabled');
    return disabled != null;
  }

  override async click(): Promise<void> {
    await this.parts.disclosure.click();
  }

  /**
   * Expand the accordion.
   */
  async expand(): Promise<void> {
    const expanded = await this.isExpanded();
    if (!expanded) {
      await this.parts.disclosure.click();
      await timingUtil.waitUntil({
        probeFn: () => this.isExpanded(),
        terminateCondition: true,
        timeoutMs: 1000,
      });
    }
  }

  /**
   * Collapse the accordion.
   */
  async collapse(): Promise<void> {
    const expanded = await this.isExpanded();
    if (expanded) {
      await this.parts.disclosure.click();
      await timingUtil.waitUntil({
        probeFn: () => this.isExpanded(),
        terminateCondition: false,
        timeoutMs: 1000,
      });
    }
  }

  override get driverName(): string {
    return 'MuiV7AccordionDriver';
  }
}
