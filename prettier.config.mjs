/** @type {import("prettier").Config} */
const config = {
  bracketSpacing: true,
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.html',
      options: { parser: 'angular' },
    },
  ],
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 165,
  semi: true,
  singleAttributePerLine: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
};

export default config;
