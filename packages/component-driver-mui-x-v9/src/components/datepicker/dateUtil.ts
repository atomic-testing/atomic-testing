/**
 * Parse a desktop date picker's committed value — the hidden input's locale-formatted string
 * (e.g. "06/27/2026") — into a Date, or null when the field is empty or the value cannot be
 * parsed. The explicit Invalid-Date guard avoids leaking `new Date('…')`'s implementation-defined
 * behaviour for malformed input.
 *
 * The write direction (typing a value into the section field) and the time/datetime/range
 * converters are deferred until the keystroke-based write path lands.
 */
export function textEntryToDate(text: string, _format: string): Date | null {
  if (text.length < 6) {
    return null;
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
