import angularStrict from 'eslint-config-angular-strict';

const modifiedAngularStrict = angularStrict.map((config) => {
  // 1. FIX PER I DEFAULT EXPORT NELLE ROTTE
  if (config.files?.some((f) => f.includes('routes.ts')) && config.rules?.['no-restricted-syntax']) {
    const ruleConfig = config.rules['no-restricted-syntax'];
    if (Array.isArray(ruleConfig)) {
      const [severity, ...restrictions] = ruleConfig;
      const updatedRestrictions = restrictions.map((restriction) => {
        if (restriction.message?.includes('Only imports and export const allowed')) {
          return {
            ...restriction,
            selector: restriction.selector.replace(/\)$/, ', ExportDefaultDeclaration)'),
            message: 'Only imports, export const, and export default allowed in *.routes.ts',
          };
        }
        return restriction;
      });
      return {
        ...config,
        rules: { ...config.rules, 'no-restricted-syntax': [severity, ...updatedRestrictions] },
      };
    }
  }

  // 2. FIX STRATEGICO CON FILTRO PER I RESOLVER
  if (config.rules?.['@typescript-eslint/naming-convention']) {
    const namingRule = config.rules['@typescript-eslint/naming-convention'];
    if (Array.isArray(namingRule)) {
      const [severity, ...formats] = namingRule;

      const updatedFormats = formats.map((item) => {
        // Identifichiamo la regola delle costanti esportate
        if (item.selector === 'variable' && item.modifiers?.includes('exported') && item.modifiers?.includes('const')) {
          return {
            ...item,
            // Aggiungiamo il filtro di esclusione
            filter: {
              regex: '(Resolver|Guard)$|^(with|provide|create|handle|bootstrap)',
              match: false, // false = escludi questi risultati dalla regola UPPER_CASE
            },
          };
        }
        return item;
      });

      return {
        ...config,
        rules: {
          ...config.rules,
          '@typescript-eslint/naming-convention': [severity, ...updatedFormats],
        },
      };
    }
  }

  return config;
});

export default [
  ...modifiedAngularStrict,
  // Your custom overrides here

  {
    rules: {
      // Disabilita il suggerimento di usare .toArray() sugli iteratori
      'unicorn/prefer-iterator-to-array': 'off',
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          ignoreCase: true,
          customGroups: [
            { elementNamePattern: '^@angular/', groupName: 'angular' },
            { elementNamePattern: '^rxjs', groupName: 'rxjs' },
            { elementNamePattern: '^@nestjs/', groupName: 'nestjs' },
            { elementNamePattern: '^firebase', groupName: 'firebase' },
            { elementNamePattern: '^ng-zorro-antd/', groupName: 'ng-zorro' },
            { elementNamePattern: '^@(app|data|layout|env|modules|shared|worker)/', groupName: 'internal-aliases' },
          ],
          groups: [
            'value-builtin',
            'angular',
            'rxjs',
            'nestjs',
            'firebase',
            'ng-zorro',
            'value-external',
            'internal-aliases',
            'value-internal',
            'value-parent',
            'value-sibling',
            'value-index',
            'unknown',
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts'], // <-- Fondamentale: applica la regola SOLO ai file .ts
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
        },
      ],
    },
  },
];
