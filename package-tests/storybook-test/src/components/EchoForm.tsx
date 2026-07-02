import { useState } from 'react';

/**
 * Controlled input whose value is mirrored into a sibling element — reading the
 * echo after typing exercises multi-part engines and read-after-write settling.
 */
export function EchoForm() {
  const [text, setText] = useState('');
  return (
    <form>
      <input data-testid='echo-input' value={text} onChange={e => setText(e.target.value)} />
      <output data-testid='echo-output'>{text}</output>
    </form>
  );
}
