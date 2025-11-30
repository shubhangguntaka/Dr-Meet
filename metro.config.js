const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable asset optimization
config.transformer = {
  ...config.transformer,
  minifierPath: 'metro-minify-terser',
  minifierConfig: {
    compress: {
      drop_console: true, // Remove console.logs
      drop_debugger: true,
    },
  },
};

// Optimize assets
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts, 'db', 'mp3', 'ttf', 'obj', 'png', 'jpg'],
};

module.exports = config;
