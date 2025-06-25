import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { byAttribute, ScenePart, TestEngine } from '@atomic-testing/core';

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

  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ imports: [component] });
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();

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
  rootElement: HTMLElement,
  partDefinitions: T,
  _option?: Readonly<Partial<IAngularTestEngineOption>>
): TestEngine<T> {
  const rootId = getNextRootElementId();
  rootElement.setAttribute(rootElementAttributeName, rootId);

  const cleanup = () => {
    rootElement.removeAttribute(rootElementAttributeName);
    return Promise.resolve();
  };

  return new TestEngine(
    byAttribute(rootElementAttributeName, rootId),
    new AngularInteractor(undefined),
    {
      parts: partDefinitions,
    },
    cleanup
  );
}
