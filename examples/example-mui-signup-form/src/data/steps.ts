export interface Step {
  sequence: number;
  name: string;
}

export const steps: readonly Readonly<Step>[] = [
  { sequence: 1, name: 'Account Information' },
  { sequence: 2, name: 'Shipping Address' },
  { sequence: 3, name: 'Billing Address' },
  { sequence: 4, name: 'Interests' },
  { sequence: 5, name: 'Review' }
] as const;

export const stepsBySequence: Map<number, Readonly<Step>> = new Map(steps.map((step) => [step.sequence, step]));
