import path from 'node:path'
import { fileURLToPath } from 'node:url'

import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
// import prettier from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import parser from 'vue-eslint-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default await antfu(
  {
    ignores: [
      '**/.output',
      '**/node_modules',
      '**/pnpm-lock.yaml',
      '**/coverage',
      '**/README.md',
      '**/coverage',
      '**/deployment',
      '**/dist',
      '**/dist-ssr',
      '**/public',
      '**/sequelize',
      '**/storage',
      '**/tmp',
      '**/.eslintrc.js',
      '**/*.config.js',
      '**/components.d.ts',
      '**/*.validator.ts',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      // prettier,
      'simple-import-sort': simpleImportSort,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      ecmaVersion: 2022,
      sourceType: 'module',
    },

    rules: {
      'import/order': 'off',
      'no-console': 'off',
      'comma-dangle': 0,
      'node/prefer-global/buffer': ['error', 'always'],
      'node/prefer-global/process': ['error', 'always'],
      'unused-imports/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'jsdoc/require-returns-description': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^node:'],
            ['^@?(?!intake24)\\w.*\\u0000$', '^@?(?!intake24)\\w'],
            ['(?<=\\u0000)$', '^'],
            ['^\\..*\\u0000$', '^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'sort-imports': 'off',
      'style/quote-props': ['error', 'as-needed'],
      'style/member-delimiter-style': [
        'error',
        { multiline: { delimiter: 'semi' }, singleline: { delimiter: 'semi' } },
      ],
      'ts/ban-types': 'off',
      'ts/consistent-type-imports': 'off',
      'ts/consistent-type-definitions': 'off',
      'ts/no-explicit-any': 'off',
      'ts/no-use-before-define': 'warn',
      'vue/attributes-order': ['error', { alphabetical: true }],
      'vue/block-order': [
        'error',
        { order: [['script', 'template'], 'style'] },
      ],
      'vue/component-name-in-template-casing': ['error', 'kebab-case'],
      'vue/custom-event-name-casing': 'off',
      'vue/multi-word-component-names': 'warn',
      'vue/no-setup-props-destructure': 'warn',
      'vue/require-default-prop': 'off',
      'vue/valid-v-slot': ['error', { allowModifiers: true }],
    },
  },
  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],

    languageOptions: {
      parser,
      ecmaVersion: 'latest',
      sourceType: 'script',

      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.md/*.js', '**/*.md/*.ts'],

    rules: {
      'no-console': 'off',
      'import/no-unresolved': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
        },
      ],
    },
  },
)
