import { ComponentDriver } from './ComponentDriver';

export class SimpleComponentDriver extends ComponentDriver<{}> {
  get driverName(): string {
    return 'simple';
  }
}
