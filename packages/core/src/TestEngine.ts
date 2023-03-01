import { ComponentDriver } from './ComponentDriver';
import { ScenePart } from './types';

export class TestEngine<T extends ScenePart> extends ComponentDriver<T> {
  get driverName(): string {
    return 'TestEngine';
  }
}
