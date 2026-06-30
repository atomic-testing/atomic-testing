import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

import { TEAMS } from '../../data/seed';
import { TEAM_TREE_ID, TeamNavDataTestId } from './TeamNavDataTestId';

const QUEUE_IDS = new Set(TEAMS.flatMap(team => team.queues.map(queue => queue.id)));

export interface TeamNavProps {
  'data-testid'?: string;
  selectedQueue: string | null;
  onSelectQueue: (queueId: string | null) => void;
}

// Team -> queue sidebar. Selecting a queue (a leaf) filters the grid; selecting a team (a branch)
// only expands/collapses it. State is controlled by the console hook.
export function TeamNav({ selectedQueue, onSelectQueue, ...rest }: TeamNavProps) {
  return (
    <div data-testid={rest['data-testid'] ?? TeamNavDataTestId.root}>
      <SimpleTreeView
        id={TEAM_TREE_ID}
        defaultExpandedItems={TEAMS.map(team => team.id)}
        selectedItems={selectedQueue}
        onSelectedItemsChange={(_event, itemId) => {
          if (itemId != null && QUEUE_IDS.has(itemId)) {
            onSelectQueue(itemId);
          }
        }}>
        {TEAMS.map(team => (
          <TreeItem key={team.id} itemId={team.id} label={team.label}>
            {team.queues.map(queue => (
              <TreeItem key={queue.id} itemId={queue.id} label={queue.label} />
            ))}
          </TreeItem>
        ))}
      </SimpleTreeView>
    </div>
  );
}
