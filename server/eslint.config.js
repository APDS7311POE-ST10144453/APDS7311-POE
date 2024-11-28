const security = require('eslint-plugin-security');

module.exports = [
  {
    files: ['**/*.js', '**/*.mjs'],
    ignores: ['node_modules/**', 'dist/**', 'test-results/**'],
    plugins: {
      security,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        node: true,
        es2024: true,
      },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'error',
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-eval-with-expression': 'error',
      'strict': ['error', 'global'],
    },
  },
];