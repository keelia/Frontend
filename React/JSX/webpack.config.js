const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
 module.exports = {
   mode: 'development',
   entry: {
     index: './main.js',
   },
   devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
   plugins: [
    new HtmlWebpackPlugin({
        title: 'App JSX without React',
      }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
   }
 };