/* eslint-disable import/no-extraneous-dependencies */
import { minify } from 'html-minifier';

const minifyHtml = (indexHtml: string): string => {
  const fixed = indexHtml.replaceAll(
    '<link rel="modulepreload" href="chunk-',
    '<link rel="modulepreload" href="/chunk-',
  );
  const minified = minify(fixed, {
    collapseWhitespace: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
  });

  return minified;
};

export default minifyHtml;
