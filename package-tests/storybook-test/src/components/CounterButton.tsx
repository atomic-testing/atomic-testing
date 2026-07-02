import { useState } from 'react';

export interface CounterButtonProps {
  label?: string;
}

/**
 * Minimal stateful component: the post-click label change only appears after a
 * React re-render, which is exactly what the interactor's settle path must cover.
 */
export function CounterButton({ label = 'Count' }: CounterButtonProps) {
  const [count, setCount] = useState(0);
  return (
    <button type='button' onClick={() => setCount(c => c + 1)}>
      {`${label}: ${count}`}
    </button>
  );
}
