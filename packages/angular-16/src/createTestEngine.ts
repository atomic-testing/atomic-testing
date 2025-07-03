import { byAttribute, ScenePart, TestEngine } from '@atomic-testing/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { Type } from '@angular/core';

import { AngularInteractor } from './AngularInteractor';
import { IAngularTestEngineOption } from './types';

let _rootId = 0;
function getNextRootElementId() {
  return `${_rootId++}`;
}

const rootElementAttributeName = 'data-atomic-testing-angular';

export function createTestEngine<T extends ScenePart>(
  component: Type<any>,
  partDefinitions: T,
  option?: Readonly<Partial<IAngularTestEngineOption>>
): TestEngine<T> {
  const rootEl = option?.rootElement ?? document.body;
  const container = rootEl.appendChild(document.createElement('div'));
  const rootId = getNextRootElementId();
  container.setAttribute(rootElementAttributeName, rootId);

  const moduleMeta: TestModuleMetadata = option?.moduleMetadata ?? {};
  TestBed.configureTestingModule({
    declarations: [component, ...(moduleMeta.declarations ?? [])],
    ...moduleMeta,
  }).compileComponents();

  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  (fixture.nativeElement as HTMLElement).setAttribute(rootElementAttributeName, rootId);

  const cleanup = () => {
    fixture.destroy();
    rootEl.removeChild(container);
    return Promise.resolve();
  };

  return new TestEngine(
    byAttribute(rootElementAttributeName, rootId),
    new AngularInteractor(fixture),
    {
      parts: partDefinitions,
    },
    cleanup
  );
}

export function createRenderedTestEngine<T extends ScenePart>(
  fixture: ComponentFixture<any>,
  partDefinitions: T,
  _option?: Readonly<Partial<IAngularTestEngineOption>>
): TestEngine<T> {
  const rootId = getNextRootElementId();
  (fixture.nativeElement as HTMLElement).setAttribute(rootElementAttributeName, rootId);

  const cleanup = () => {
    (fixture.nativeElement as HTMLElement).removeAttribute(rootElementAttributeName);
    fixture.destroy();
    return Promise.resolve();
  };

  return new TestEngine(
    byAttribute(rootElementAttributeName, rootId),
    new AngularInteractor(fixture),
    {
      parts: partDefinitions,
    },
    cleanup
  );
}
