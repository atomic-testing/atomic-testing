import { Interactor } from '../../interactor/Interactor';
import { byDataTestId } from '../../locators/byDataTestId';
import type { PartLocator } from '../../locators/PartLocator';
import { IComponentDriverOption, ScenePart } from '../../partTypes';
import { ComponentDriver } from '../ComponentDriver';
import { ContainerDriver } from '../ContainerDriver';

/** A leaf driver that records the option it was constructed with. */
class RecordingDriver extends ComponentDriver {
  readonly receivedOption: Partial<IComponentDriverOption>;

  constructor(locator: PartLocator, interactor: Interactor, option: Partial<IComponentDriverOption> = {}) {
    super(locator, interactor, option);
    this.receivedOption = option;
  }

  get driverName(): string {
    return 'RecordingDriver';
  }
}

const contentParts = {
  body: { locator: byDataTestId('body'), driver: RecordingDriver },
} satisfies ScenePart;

const declaredParts = {
  header: { locator: byDataTestId('header'), driver: RecordingDriver },
} satisfies ScenePart;

class ProbeContainerDriver extends ContainerDriver<typeof contentParts, typeof declaredParts> {
  get driverName(): string {
    return 'ProbeContainerDriver';
  }
}

const stubInteractor = {} as Interactor;

function createContainer(option: Partial<IComponentDriverOption> = {}) {
  return new ProbeContainerDriver(byDataTestId('dialog'), stubInteractor, {
    content: contentParts,
    parts: declaredParts,
    ...option,
  });
}

describe('ContainerDriver', () => {
  it('builds content parts from the same shared option its declared parts get', () => {
    const container = createContainer({ theme: 'dark' } as Partial<IComponentDriverOption>);

    expect(container.content.body.receivedOption).toEqual(container.parts.header.receivedOption);
    expect(container.content.body.receivedOption.theme).toBe('dark');
  });

  it('keeps the container-specific `content` out of the shared slice', () => {
    const container = createContainer();

    expect(container.commutableOption).not.toHaveProperty('content');
    expect(container.parts.header.receivedOption).not.toHaveProperty('content');
    expect(container.content.body.receivedOption).not.toHaveProperty('content');
  });

  it('roots content parts at the container locator', () => {
    const container = createContainer();

    expect(container.content.body.locator.map(loc => loc.selector)).toEqual([
      '[data-testid="dialog"]',
      '[data-testid="body"]',
    ]);
  });

  it('tolerates being constructed with no option at all', () => {
    const container = new ProbeContainerDriver(byDataTestId('dialog'), stubInteractor);

    expect(container.content).toEqual({});
    expect(container.commutableOption).toEqual({});
  });
});
