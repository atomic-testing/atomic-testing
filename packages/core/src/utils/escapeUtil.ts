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
 * Backslashes, spaces, and non-identifier characters (e.g., ! " # $ % & ' ( ) * + , . / : ; < = > ? @ [ ] ^ ` { | } ~) are escaped.
 * @param value
 * @returns
 */
export function escapeValue(value: string): string {
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

export function escapeCssClassName(name: string): string {
  return name;
}
