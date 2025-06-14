export interface UserInterest {
  id: string;
  label: string;
}

export const userInterests: readonly Readonly<UserInterest>[] = [
  { id: 'sports', label: 'Sports' },
  { id: 'music', label: 'Music' },
  { id: 'reading', label: 'Reading' },
  { id: 'traveling', label: 'Traveling' },
  { id: 'cooking', label: 'Cooking' }
].sort((a, b) => a.label.localeCompare(b.label));
