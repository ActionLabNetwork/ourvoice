import type { CodegenConfig } from '@graphql-codegen/cli'
import * as path from 'path'

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  documents: path.join("./src/graphql/**/**.ts"),
  ignoreNoDocuments: false,
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      config: {
        useTypeImports: false,
        avoidOptionals: {
          defaultValue: true,
          field: true
        }
      },
    },
  },
}

export default config