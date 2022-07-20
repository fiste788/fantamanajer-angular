/* eslint-disable import/no-extraneous-dependencies */
import { TargetOptions } from '@angular-builders/custom-webpack';
import * as minfier from 'html-minifier';

export default (targetOptions: TargetOptions, indexHtml: string): string => {
  if (!targetOptions.configuration?.includes('development')) {
    const minified = minfier.minify(indexHtml, {
      collapseWhitespace: true,
      minifyJS: true,
      removeAttributeQuotes: true,
      removeComments: true,
    });

    return minified;
  }

  return indexHtml;
};
