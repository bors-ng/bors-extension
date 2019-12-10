const path = require('path');

module.exports = {
  entry: {
    bors: './src/bors_entry.js',
    options: './src/options_entry.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};