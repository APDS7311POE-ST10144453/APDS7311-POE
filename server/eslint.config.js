import js from '@eslint/js';
import security from 'eslint-plugin-security';
import node from 'eslint-plugin-node';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'dist/**'],
    plugins: {
      security,
      node,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      env: {
        node: true,
        es2024: true,
      },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'error',
      'node/no-unsupported-features/es-syntax': 'error',
      'node/no-missing-require': 'error',
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-eval-with-expression': 'error',
      'strict': ['error', 'global'],
    },
  },
];