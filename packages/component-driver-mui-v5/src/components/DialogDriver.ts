import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ContainerDriver,
  IContainerDriverOption,
  IInteractor,
  LocatorChain,
  LocatorRelativePosition,
  LocatorType,
  Optional,
  PartLocatorType,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  title: {
    locator: byCssClass('MuiDialogTitle-root'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

const dialogRootLocator: PartLocatorType = {
  type: LocatorType.Css,
  selector: '[role=presentation].MuiDialog-root',
  relative: LocatorRelativePosition.Root,
};

export class DialogDriver<ContentT extends ScenePart> extends ContainerDriver<ContentT, typeof parts> {
  constructor(locator: LocatorChain, interactor: IInteractor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  override overriddenParentLocator(): Optional<LocatorChain> {
    return [dialogRootLocator];
  }

  override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return LocatorRelativePosition.Same;
  }

  async getTitle(): Promise<string | null> {
    await this.enforcePartExistence('title');
    const title = await this.parts.title.getText();
    return title ?? null;
  }

  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  get driverName(): string {
    return 'MuiV5DialogDriver';
  }
}
