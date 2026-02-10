const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const manifest = require('./src/manifest.json');

module.exports = {
  entry: {
    'script': './src/script.js',
    'popup': './src/popup.js',
    'background': './src/background.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      __VERSION__: JSON.stringify(manifest.version)
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['script'],
      templateParameters: {
        version: manifest.version
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
      templateParameters: {
        version: manifest.version
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/manifest.json', to: 'manifest.json' },
        { from: './src/assets/icons', to: 'icons', noErrorOnMissing: true }
      ]
    })
  ],
  optimization: {
    splitChunks: false
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};