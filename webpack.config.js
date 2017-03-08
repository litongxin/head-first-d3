var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    bkc1: "./src/js/bkc1.js",
    bkc2: "./src/js/bkc2.js",
    lec1: "./src/js/lec1.js",
    lec2: "./src/js/lec2.js"
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader","css-loader", "sass-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.(csv)$/,
        loader: "static-loader?name=${}`,",
        exclude: /node_modules/
      }
    ]
  }
}
