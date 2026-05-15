import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: false,
  jPath: true,
  isArray: (_name, jPath) => (jPath as string).includes('.')
});

export const parseResponse = (xml: string): unknown => parser.parse(xml);

const unwrap = (value: unknown): unknown =>
  Array.isArray(value) ? value[0] : value;

const descend = (current: unknown, key: string): unknown => {
  const node = unwrap(current);
  if (node === null || typeof node !== 'object') return undefined;
  return (node as Record<string, unknown>)[key];
};

/** Walk a path through parsed XML, returning the raw node (object/array/string) at the end. */
export const pickNode = (
  root: unknown,
  path: ReadonlyArray<string>
): unknown => {
  let current: unknown = root;
  for (const segment of path) {
    current = descend(current, segment);
    if (current === undefined) return undefined;
  }
  return unwrap(current);
};

/** Read a leaf string value at the given path. Returns undefined if any segment is missing. */
export const pick = (
  root: unknown,
  path: ReadonlyArray<string>
): string | undefined => {
  const value = pickNode(root, path);
  return typeof value === 'string' ? value : undefined;
};

/** Read a numeric leaf at the given path, falling back to defaultValue if missing or NaN. */
export const pickNumber = (
  root: unknown,
  path: ReadonlyArray<string>,
  defaultValue = 0
): number => {
  const value = pick(root, path);
  if (value === undefined) return defaultValue;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

/**
 * Read a boolean leaf at the given path. The Yamaha API uses string flags like
 * 'On'/'Off' or 'Auto'/'Off' — by convention, anything other than `offValue` (and
 * a present node) is considered "on". Missing path → false.
 */
export const pickFlag = (
  root: unknown,
  path: ReadonlyArray<string>,
  offValue = 'Off'
): boolean => {
  const value = pick(root, path);
  return value !== undefined && value !== offValue;
};
