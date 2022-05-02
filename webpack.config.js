var CompressionPlugin = require('compression-webpack-plugin');
//var RelativeCiAgentWebpackPlugin = require('@relative-ci/agent');
var StatsWriterPlugin = require('webpack-stats-plugin');

module.exports = {
  plugins: [
    //new RelativeCiAgentWebpackPlugin(),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg|txt|eot|otf|ttf|gif)$/,
      threshold: 10240,
      minRatio: 0.9,
      deleteOriginalAssets: false,
    }),
    new StatsWriterPlugin.StatsWriterPlugin({
      filename: 'stats.json',
      stats: {
        context: './src', // optional, will improve readability of the paths
        assets: true,
        entrypoints: true,
        chunks: true,
        modules: true,
      },
    }),
  ],
};
