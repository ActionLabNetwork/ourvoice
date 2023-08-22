import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yml';

export default () => {
  if (process.env.NODE_ENV === 'test') {
    return { moderatorCount: 1 };
  }
  return yaml.load(
    readFileSync(join('../../config/', YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};
