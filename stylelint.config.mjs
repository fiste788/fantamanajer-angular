/** @type {import('stylelint').Config} */
export default {
  plugins: ['stylelint-browser-compat', 'stylelint-plugin-use-baseline'],
  extends: ['stylelint-prettier/recommended', 'stylelint-config-standard-scss'],
  rules: {
    'block-no-empty': null,
    'plugin/browser-compat': [
      true,
      {
        allow: {
          features: [
            'at-rules.supports',
            'selectors.host-context',
            'properties.view-transition-name',
            'selectors.view-transition-new',
            'selectors.view-transition-old',
            'selectors.view-transition-group',
            'selectors.view-transition-image-pair',
          ],
          flagged: false,
          partialImplementation: false,
          prefix: true,
        },
      },
    ],
    'plugin/use-baseline': [
      true,
      {
        // "widely" (default), "newly", or YYYY (e.g. 2023)
        available: 'widely',
        ignoreSelectors: ['nesting', 'host-context'],
        ignoreProperties: ['text-wrap'],
      },
    ],
  },
};
