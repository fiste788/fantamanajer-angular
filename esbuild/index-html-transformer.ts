import { minify } from 'html-minifier-next';

const minifyHtml = async (indexHtml: string): Promise<string> => {
  const minified = await minify(indexHtml, {
    collapseWhitespace: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
  });

  return minified;
};

export default minifyHtml;
