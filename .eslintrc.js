module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'simple-import-sort', 'import'],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  overrides: [
    {
      files: ['*.ts'],
    },
    {
      // Avoid Cypress Mocha/Chai clash with Jest
      files: ['packages/cypress/__tests__/**/*.test.ts'],
      rules: {
        'jest/valid-expect': 'off',
      },
    },
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'eslint-comments/disable-enable-pair': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    'jest/expect-expect': 'off',
    'no-empty': 'off',
    'no-restricted-properties': [
      'error',
      {
        property: 'substr',
        message: 'Deprecated: Use .slice() instead of .substr().',
      },
    ],
    'jest/valid-title': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'jest/no-conditional-expect': 'off',
    'jest/no-export': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'jest/no-standalone-expect': [
      'error',
      {
        additionalTestBlockFunctions: ['testIf', 'describeIf'],
      },
    ],
    'simple-import-sort/imports': 'warning',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
  settings: {
    jest: {
      version: 29,
      globalAliases: {
        describe: 'describeIf',
      },
    },
  },
};
