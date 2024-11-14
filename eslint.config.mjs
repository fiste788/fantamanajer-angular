// @ts-check

// Allows us to bring in the recommended core rules from eslint itself
import eslint from '@eslint/js';

// Allows us to use the typed utility for our config, and to bring in the recommended rules for TypeScript projects from typescript-eslint
import tseslint from 'typescript-eslint';

// Allows us to bring in the recommended rules for Angular projects from angular-eslint
import angular from 'angular-eslint';

import rxjsX from 'eslint-plugin-rxjs-x';

import eslintPluginUnicorn from 'eslint-plugin-unicorn';

// @ts-ignore
import importPlugin from 'eslint-plugin-import';

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

// Export our config array, which is composed together thanks to the typed utility function from typescript-eslint
export default tseslint.config(
  {
    // Everything in this config object targets our TypeScript files (Components, Directives, Pipes etc)
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      // Apply the recommended core rules
      eslint.configs.recommended,
      // Apply the recommended TypeScript rules
      ...tseslint.configs.recommendedTypeChecked,
      // Optionally apply stylistic rules from typescript-eslint that improve code consistency
      ...tseslint.configs.stylisticTypeChecked,
      // Apply the recommended Angular rules
      ...angular.configs.tsRecommended,

      rxjsX.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,

      eslintPluginUnicorn.configs['flat/recommended'],
      eslintPluginPrettierRecommended,
    ],
    // Set the custom processor which will allow us to have our inline Component templates extracted
    // and treated as if they are HTML files (and therefore have the .html config below applied to them)
    processor: angular.processInlineTemplates,
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    // Override specific rules for TypeScript files (these will take priority over the extended configs above)
    rules: {
      '@angular-eslint/component-class-suffix': [
        'error',
        {
          suffixes: ['Component', 'Page', 'Modal'],
        },
      ],
      '@angular-eslint/component-max-inline-declarations': 'error',
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/no-attribute-decorator': 'error',
      '@angular-eslint/no-forward-ref': 'error',
      '@angular-eslint/no-lifecycle-call': 'error',
      '@angular-eslint/no-pipe-impure': 'error',
      '@angular-eslint/no-queries-metadata-property': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/use-component-view-encapsulation': 'error',
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'generic',
        },
      ],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            accessors: 'no-public',
            constructors: 'no-public',
            methods: 'explicit',
            properties: 'explicit',
            parameterProperties: 'explicit',
          },
        },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'signature',
            'public-decorated-field',
            'protected-decorated-field',
            'private-decorated-field',
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            'public-static-method',
            'protected-static-method',
            'private-static-method',
            'public-constructor',
            'protected-constructor',
            'public-instance-method',
            'protected-instance-method',
            'private-constructor',
            'private-instance-method',
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extraneous-class': [
        'error',
        {
          allowEmpty: true,
          allowStaticOnly: true,
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
        },
      ],
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNullableObject: true,
          allowNullableBoolean: true,
          allowNullableString: true,
          allowNullableNumber: true,
        },
      ],
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/unbound-method': 'error',
      'arrow-parens': ['error', 'always'],
      'brace-style': ['error', '1tbs'],
      'class-methods-use-this': ['off'],
      'comma-dangle': ['error', 'always-multiline'],
      complexity: [
        'error',
        {
          max: 20,
        },
      ],
      'default-case': 'error',
      'max-lines': ['error', 400],
      'new-parens': 'error',
      'newline-per-chained-call': 'error',
      'no-constant-condition': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'error',
      'no-extra-bind': 'error',
      'no-invalid-this': 'error',
      'no-multiple-empty-lines': 'error',
      'no-new-func': 'error',
      'no-plusplus': 'error',
      'no-redeclare': 'error',
      'no-restricted-syntax': ['error', 'ForInStatement'],
      'no-return-await': 'error',
      'no-sequences': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-void': [
        'error',
        {
          allowAsStatement: true,
        },
      ],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
      ],
      'prefer-object-spread': 'error',
      'prefer-template': 'error',
      'rxjs-x/no-async-subscribe': 'error',
      'rxjs-x/no-ignored-observable': 'error',
      'rxjs-x/no-ignored-subscription': 'warn',
      'rxjs-x/no-nested-subscribe': 'error',
      'rxjs-x/no-unbound-methods': 'error',
      'rxjs-x/throw-error': 'error',
      'sort-keys': 'off',
      'space-in-parens': ['error', 'never'],
      'unicorn/filename-case': 'error',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-event-target': 'off',
      yoda: 'error',
    },
  },
  {
    // Everything in this config object targets our HTML files (external templates,
    // and inline templates as long as we have the `processor` set on our TypeScript config above)
    files: ['**/*.html'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      // Apply the recommended Angular template rules
      ...angular.configs.templateRecommended,
      // Apply the Angular template rules which focus on accessibility of our apps
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
