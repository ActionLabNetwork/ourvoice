import { readFileSync } from 'fs';
import dotenv from 'dotenv';

export default () => {
  console.log('ENV');
  return dotenv.parse(readFileSync('../../.env')) as Record<string, any>;
};
