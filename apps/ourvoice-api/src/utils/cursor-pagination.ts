import { Buffer } from 'buffer';

export function numberToCursor(number: number): string {
  if (typeof number !== 'number' || isNaN(number)) {
    throw new Error('Invalid input: number must be a valid number');
  }

  if (number < 0) {
    throw new Error('Invalid input: number must be a non-negative integer');
  }

  return Buffer.from(number.toString()).toString('base64');
}

export function cursorToNumber(cursor: string): number {
  if (typeof cursor !== 'string' || cursor.length === 0) {
    throw new Error('Invalid input: cursor must be a non-empty string');
  }

  let decoded;
  try {
    decoded = Buffer.from(cursor, 'base64').toString('ascii');
  } catch (error) {
    throw new Error('Invalid input: cursor must be a valid base64 string');
  }

  const parsedNumber = parseInt(decoded, 10);

  if (isNaN(parsedNumber) || parsedNumber < 0) {
    throw new Error(
      'Invalid input: cursor must represent a non-negative integer',
    );
  }

  return parsedNumber;
}
