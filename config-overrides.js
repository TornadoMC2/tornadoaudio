const { override } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  (config) => {
    // Add fallback for buffer (note: 'fallback' not 'fallbacks')
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/')
    };

    // Add ProvidePlugin to automatically load Buffer
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      })
    );

    // Add rule for markdown files
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/resource'
    });

    return config;
  }
);
