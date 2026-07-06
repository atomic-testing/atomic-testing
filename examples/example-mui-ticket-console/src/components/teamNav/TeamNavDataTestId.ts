export const TeamNavDataTestId = {
  root: 'team-nav',
} as const;

// The SimpleTreeView's explicit DOM id, so tree item element ids are the deterministic
// `${TEAM_TREE_ID}-${itemId}` the driver targets (instead of MUI's environment-dependent
// auto-generated prefix).
export const TEAM_TREE_ID = 'team-tree';
