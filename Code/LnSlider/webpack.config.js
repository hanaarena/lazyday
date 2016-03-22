var webpack = require('webpack');

module.exports = {
  entry: './src/LnSlider.js',
  output: {
    filename: 'bundle.js',
    path: './dist/'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
