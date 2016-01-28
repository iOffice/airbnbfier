const path = require('path');


module.exports = function karmaExports(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      '../spec/index.js',
    ],
    preprocessors: {
      '../spec/index.js': ['webpack'],
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015'],
            },
            exclude: path.resolve(__dirname, '../node_modules'),
          },
        ],
      },
      watch: true,
    },
    webpackServer: {
      noInfo: true,
    },
    reporters: ['progress'],
    port: 9876,
    plugins: [
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-jasmine',
    ],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
  });
};
