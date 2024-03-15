/* eslint-disable import/no-extraneous-dependencies */
import { Target } from '@angular-devkit/architect/src/input-schema';
import { json } from '@angular-devkit/core';
import { minify } from 'html-minifier';

type TargetOptions = json.JsonObject & Target;

const minifyHtml = (targetOptions: TargetOptions, indexHtml: string): string => {
  if (!targetOptions.configuration?.includes('development')) {
    const minified = minify(indexHtml, {
      collapseWhitespace: true,
      minifyJS: true,
      removeAttributeQuotes: true,
      removeComments: true,
    });

    return minified;
  }

  return indexHtml;
};

export default minifyHtml;
