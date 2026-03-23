// eslint.config.js  (ESLint v9 flat config)
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // TypeScript-aware replacements for base rules
      'no-unused-vars'                          : 'off',
      '@typescript-eslint/no-unused-vars'       : ['error', { argsIgnorePattern: '^_' }],
      'no-undef'                                : 'off',   // tsc handles this

      // Prevent accidental `any`
      '@typescript-eslint/no-explicit-any'      : 'warn',

      // Consistency
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // Catch common runtime mistakes
      '@typescript-eslint/no-floating-promises' : 'error',
      'eqeqeq'                                  : ['error', 'always'],
    },
  },
  {
    // Don't lint build output or config files
    ignores: ['dist/**', 'node_modules/**'],
  },
]