import * as webpack from 'webpack';
import BrotliPlugin from 'brotli-webpack-plugin';

const config: webpack.Configuration = {
  plugins: [
    new BrotliPlugin({
      asset: '[fileWithoutExt].[ext].br',
      threshold: 0,
      minRatio: 0.8,
      test: /\.(js|css|html|svg|txt|eot|otf|ttf|gif)$/,
    }),
  ],
};

export default config;
