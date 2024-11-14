/** @type {import("prettier").Config} */
const config = {
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  bracketSpacing: true,
  printWidth: 100,
  endOfLine: 'lf',
  singleAttributePerLine: true,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
