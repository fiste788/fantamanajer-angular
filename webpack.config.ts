import CompressionPlugin from 'compression-webpack-plugin';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
  plugins: [
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg|txt|eot|otf|ttf|gif)$/,
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
  ],
  stats: {
    assets: true,
    entrypoints: true,
    chunks: true,
    modules: true,
  },
};

export default config;
