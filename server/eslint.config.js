const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');

const tsConfigs = tsPlugin.configs['flat/recommended-type-checked'].map((config) => {
  const filePatterns = config.files ?? ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];

  return {
    ...config,
    files: filePatterns,
    languageOptions: {
      ...config.languageOptions,
      parser: tsParser,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      ...config.plugins,
      '@typescript-eslint': tsPlugin,
    },
  };
});

module.exports = [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  js.configs.recommended,
  ...tsConfigs,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: false,
          tabWidth: 2,
          trailingComma: 'es5',
          printWidth: 100,
          endOfLine: 'auto',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
