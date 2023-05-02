import { Buffer } from 'buffer';

export function numberToCursor(number: number): string {
  return Buffer.from(number.toString()).toString('base64');
}

export function cursorToNumber(cursor: string): number {
  return parseInt(Buffer.from(cursor, 'base64').toString('ascii'), 10);
}
