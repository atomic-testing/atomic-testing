import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  title: {
    locator: byCssClass('MuiAlertTitle-root'),
    driver: HTMLElementDriver,
  },
  message: {
    locator: byCssClass('MuiAlert-message'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

interface AlertSeverityEvaluator {
  value: string;
  pattern: RegExp;
}
const alertSeverityEvaluators: AlertSeverityEvaluator[] = [
  { value: 'error', pattern: /MuiAlert-.*Error/ },
  { value: 'warning', pattern: /MuiAlert-.*Warning/ },
  { value: 'info', pattern: /MuiAlert-.*Info/ },
  { value: 'success', pattern: /MuiAlert-.*Success/ },
];

/**
 * Driver for Material UI v6 Alert component.
 * @see https://mui.com/material-ui/react-alert/
 */
export class AlertDriver<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  async getTitle(): Promise<string | null> {
    const title = await this.parts.title.getText();
    return title ?? null;
  }

  async getMessage(): Promise<string | null> {
    const message = await this.parts.message.getText();
    if (message == null) {
      return null;
    }
    // `AlertTitle` (`.MuiAlertTitle-root`) renders *inside* `.MuiAlert-message`, so the
    // message node's text is the title concatenated ahead of the body. Strip the title
    // prefix so getMessage returns only the body; with no title the message is returned
    // verbatim. Guard with exists() first — reading text off an absent node auto-waits to
    // the timeout in Playwright (jsdom returns undefined immediately).
    if (await this.interactor.exists(this.parts.title.locator)) {
      const title = await this.parts.title.getText();
      if (title != null && title !== '' && message.startsWith(title)) {
        return message.slice(title.length).trim();
      }
    }
    return message;
  }

  async getSeverity(): Promise<string | null> {
    const cssClassString = await this.interactor.getAttribute(this.locator, 'class');
    if (cssClassString != null) {
      const cssClasses = cssClassString.split(/\s+/);
      for (const cssClassName of cssClasses) {
        for (const evaluator of alertSeverityEvaluators) {
          if (evaluator.pattern.test(cssClassName)) {
            return evaluator.value;
          }
        }
      }
    }
    return null;
  }

  override get driverName(): string {
    return 'MuiV6AlertDriver';
  }
}
