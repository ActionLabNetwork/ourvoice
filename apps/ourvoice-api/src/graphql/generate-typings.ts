import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
process.chdir(__dirname);
definitionsFactory.generate({
  typePaths: ['./schemas/*.graphql', '../**/modules/**/*.graphql'],
  path: join(process.cwd(), '../graphql.ts'),
  outputAs: 'class',
  watch: true,
});
