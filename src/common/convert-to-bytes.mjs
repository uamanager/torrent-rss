import { SIZE_UNITS } from './size-units.mjs';

/**
 * Convert size to bytes
 * @param {string} sizeStr Size string
 * @returns {number}
 */
export const convertToBytes = (sizeStr) => {
  const _match = sizeStr.match(/([\d.]+)\s?(B|KB|MB|GB|TB)/i);

  if (!_match) {
    throw new Error(`Invalid size string: ${sizeStr}`);
  }

  const _value = parseFloat(_match[1]);
  const _unit = _match[2].toUpperCase();

  return Math.round(_value * SIZE_UNITS.get(_unit));
};