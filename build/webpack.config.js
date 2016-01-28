const path = require('path');
const fs = require('fs');


const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x) => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });


module.exports = {
  entry: {
    'airbnbfier': './src/index.js',
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: 'airbnbfier',
    libraryTarget: 'commonjs2',
  },
  externals: nodeModules,
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
};
