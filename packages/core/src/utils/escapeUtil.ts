const cssEscapes = new Map([
  ['!', '\\!'],
  ['"', '\\"'],
  ['#', '\\#'],
  ['$', '\\$'],
  ['%', '\\%'],
  ['&', '\\&'],
  ["'", "\\'"],
  ['(', '\\('],
  [')', '\\)'],
  ['*', '\\*'],
  ['+', '\\+'],
  [',', '\\,'],
  ['.', '\\.'],
  ['/', '\\/'],
  [':', '\\:'],
  [';', '\\;'],
  ['<', '\\<'],
  ['=', '\\='],
  ['>', '\\>'],
  ['?', '\\?'],
  ['@', '\\@'],
  ['[', '\\['],
  ['\\', '\\\\'],
  [']', '\\]'],
  ['^', '\\^'],
  ['`', '\\`'],
  ['{', '\\{'],
  ['|', '\\|'],
  ['}', '\\}'],
  ['~', '\\~'],
  [' ', '\\ '],
]);

export function escapeName(name: string): string {
  return encodeURIComponent(name);
}

const escapeCache = new Map();

/**
 * Escaping based on the CSS spec: https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
 * @param value
 * @returns
 */
export function escapeValue(value: string): string {
  // Backslashes, spaces, and non-identifier characters (e.g., ! " # $ % & ' ( ) * + , . / : ; < = > ? @ [ ] ^ ` { | } ~) are escaped.
  if (escapeCache.has(value)) {
    return escapeCache.get(value);
  }

  let escapedValue = '';
  for (const character of value) {
    if (cssEscapes.has(character)) {
      escapedValue += cssEscapes.get(character);
      continue;
    }
    escapedValue += character;
  }

  escapeCache.set(value, escapedValue);
  return escapedValue;
}

/**
 * Escapes special characters in CSS class names.
 * This is necessary for class names containing characters like colons (Tailwind's `hover:bg-blue`),
 * dots, brackets, or other CSS selector metacharacters.
 * @param name - The CSS class name to escape
 * @returns The escaped class name safe for use in CSS selectors
 */
export function escapeCssClassName(name: string): string {
  return escapeValue(name);
}
