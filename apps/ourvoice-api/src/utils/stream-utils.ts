import { Readable } from 'node:stream';

export function stringToReadable(content: string): Readable {
  return Readable.from(content);
}
