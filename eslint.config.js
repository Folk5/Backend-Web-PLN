// @ts-check
const js = require('@eslint/js');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  // Konfigurasi file yang diabaikan
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '**/*.min.js'],
  },
  // Konfigurasi utama untuk semua file JS
  {
    files: ['**/*.js'],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        // Node.js globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'writable',
        require: 'readonly',
        exports: 'writable',
        console: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        AbortController: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,

      // --- Code Quality ---
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-var': 'error',
      'prefer-const': 'warn',

      // --- Error Prevention ---
      'no-undef': 'error',
      'no-duplicate-imports': 'error',

      // --- Prettier ---
      'prettier/prettier': 'warn',
    },
  },
];
