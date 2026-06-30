import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import React, { JSX } from 'react';

export const BasicSimpleTreeView: React.FunctionComponent = () => {
  return (
    <div data-testid='basic-tree-view' style={{ minHeight: 300, minWidth: 320 }}>
      <SimpleTreeView>
        <TreeItem itemId='fruits' label='Fruits'>
          <TreeItem itemId='apple' label='Apple' />
          <TreeItem itemId='banana' label='Banana' />
        </TreeItem>
        <TreeItem itemId='vegetables' label='Vegetables'>
          <TreeItem itemId='carrot' label='Carrot' />
        </TreeItem>
      </SimpleTreeView>
    </div>
  );
};

/**
 * Basic SimpleTreeView example from MUI's website
 * @see https://mui.com/x/react-tree-view/simple-tree-view/
 */
export const basicSimpleTreeViewUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic SimpleTreeView',
  ui: <BasicSimpleTreeView />,
};
