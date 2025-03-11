import jsLint from '@eslint/js';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tsLint from 'typescript-eslint';

export default [
  {
    // Note: there should be no other properties in this object
    ignores: [
      '**/babel.config.js',
      '**/build/**',
      '**/coverage/**',
      '**/dist/**',
      '**/docs/**',
      '**/jest.config.js',
      '**/jest.config.base.js',
      '**/node_modules/**',
    ],
  },
  {
    files: ['**/*.{ts,mts,tsx}'],
    languageOptions: {
      globals: globals.builtin,
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
      },
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
  },
  jsLint.configs.recommended,
  ...tsLint.configs.recommended,
  {
    files: ['scripts/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
  },
  {
    rules: {
      // rules overrides here
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prefer-rest-params': 'off',
    },
  },
  {
    files: ['**/*.examples.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
