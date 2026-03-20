import { tanstackConfig } from '@tanstack/eslint-config';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';

export default [
  ...tanstackConfig,
  {
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      'import/no-cycle': 'off',
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index', 'object'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        { rootDir: 'src', prefix: '#' },
      ],
    },
  },
  {
    ignores: [
      'eslint.config.ts',
      'prettier.config.ts',
      '.output/**',
      'dist/**',
    ],
  },
];
