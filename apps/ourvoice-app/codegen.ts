import type { CodegenConfig } from '@graphql-codegen/cli'
import * as path from 'path'

const config: CodegenConfig = {
  // for some reason codegen needs the datetime.graphql to be specified first
  // or else it cannot resolve the DateTime scalar type
  schema: [
    "../ourvoice-api/src/graphql/schemas/datetime.graphql",
    "../ourvoice-api/src/modules/**/*.graphql",
    "../ourvoice-api/src/graphql/schemas/user.graphql",
  ],
  documents: path.join("./src/graphql/**/**.ts"),
  ignoreNoDocuments: false,
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      config: {
        skipTypename: true,
        useTypeImports: true,
        avoidOptionals: {
          defaultValue: true,
          field: true,
        },
      },
    },
  },
}

export default config