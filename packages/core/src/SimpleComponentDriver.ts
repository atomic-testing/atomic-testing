import { ComponentDriver } from './ComponentDriver';

export class SimpleComponentDriver extends ComponentDriver<{}> {
  protected getInnerPartDefinition(): Readonly<{}> | null {
    return null;
  }
  get driverName(): string {
    return 'simple';
  }
}
