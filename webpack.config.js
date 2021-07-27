const BrotliPlugin = require('brotli-webpack-plugin');
const { RelativeCiAgentWebpackPlugin } = require('@relative-ci/agent');

module.exports = {
  plugins: [
    new RelativeCiAgentWebpackPlugin(),
    new BrotliPlugin({
      asset: '[path].br',
      threshold: 0,
      minRatio: 0.8,
    }),
  ],
};
