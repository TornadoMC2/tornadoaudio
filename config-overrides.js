const { override } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  (config) => {
    // Production optimizations
    if (process.env.NODE_ENV === 'production') {
      // Disable source maps if specified
      if (process.env.GENERATE_SOURCEMAP === 'false') {
        config.devtool = false;
      }

      // Optimize chunk splitting for better caching and smaller bundle size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 10,
          maxAsyncRequests: 10,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
              name: 'react-vendors',
              priority: 20,
              reuseExistingChunk: true,
            },
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
        runtimeChunk: 'single',
        // Minimize memory usage during build
        minimize: true,
        // Reduce parallel processing to save memory
        minimizer: config.optimization.minimizer,
      };

      // Reduce memory usage during build
      config.performance = {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
    }

    // Add fallback for buffer
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

    // Disable eslint during build if specified
    if (process.env.DISABLE_ESLINT_PLUGIN === 'true') {
      config.plugins = config.plugins.filter(
        plugin => plugin.constructor.name !== 'ESLintWebpackPlugin'
      );
    }

    return config;
  }
);
