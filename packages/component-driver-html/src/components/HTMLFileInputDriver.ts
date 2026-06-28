import { ComponentDriver, IComponentDriverOption, Interactor, PartLocator } from '@atomic-testing/core';

export class HTMLFileInputDriver extends ComponentDriver<{}> {
  /**
   * Create a file input driver.
   */
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });
  }

  /**
   * Select one or more files on the `<input type="file">` element.
   *
   * A file input cannot be filled via {@link HTMLTextInputDriver.setValue} —
   * browsers block programmatic value assignment on `type=file` — so this
   * delegates to the dedicated `setInputFiles` interactor primitive.
   *
   * @param files One or more filesystem paths. Pass a single path for a
   * non-`multiple` input; pass an array for a `multiple` input.
   */
  async uploadFiles(files: string | string[]): Promise<void> {
    return this.interactor.setInputFiles(this.locator, files);
  }

  /**
   * Identifier for this driver.
   */
  get driverName(): string {
    return 'HTMLFileInput';
  }
}
