import { SimpleTreeViewDriver } from '@atomic-testing/component-driver-mui-x-v9';
import {
  byCssSelector,
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  locatorUtil,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { TEAM_TREE_ID } from './TeamNavDataTestId';

const parts = {
  tree: {
    locator: byRole('tree'),
    driver: SimpleTreeViewDriver,
  },
} satisfies ScenePart;

// Page-object driver for the team/queue sidebar. Wraps the shipped SimpleTreeViewDriver — including
// its new `selectItem` action — behind queue-oriented method names.
export class TeamNavDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  async expandTeam(teamId: string): Promise<void> {
    await this.parts.tree.expandItem(teamId);
  }

  async collapseTeam(teamId: string): Promise<void> {
    await this.parts.tree.collapseItem(teamId);
  }

  /** Select a queue (tree leaf), which filters the grid to that queue. */
  async selectQueue(queueId: string): Promise<void> {
    await this.parts.tree.selectItem(queueId);
  }

  async isQueueSelected(queueId: string): Promise<boolean> {
    return this.parts.tree.isSelected(queueId);
  }

  /** The labels of the queues under a team, in document order. Expands the team first if needed. */
  async getQueues(teamId: string): Promise<string[]> {
    await this.parts.tree.expandItem(teamId);
    const childItems = locatorUtil.append(this.locator, byCssSelector(`[id$="-${teamId}"] [role=treeitem]`));
    const ids = await this.interactor.getAttribute(childItems, 'id', true);
    const queueIds = ids.map(id => id.replace(`${TEAM_TREE_ID}-`, ''));
    const labels = await Promise.all(queueIds.map(queueId => this.parts.tree.getItemLabel(queueId)));
    return labels.filter((label): label is string => label != null);
  }

  override get driverName(): string {
    return 'TeamNavDriver';
  }
}
