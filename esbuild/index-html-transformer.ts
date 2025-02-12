import { minify } from 'html-minifier';

const minifyHtml = (indexHtml: string): string => {
  const minified = minify(indexHtml, {
    collapseWhitespace: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
  });

  return minified;
};

export default minifyHtml;
