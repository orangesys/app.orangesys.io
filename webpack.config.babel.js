/* eslint-disable no-use-before-define, no-undef, global-require */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const postcssCustomProperties = require('postcss-custom-properties')
// const cssVariables = require('./src/css-variables').default
require('react-hot-loader/patch')

const postcss = {
  autoprefixer: require('autoprefixer'),
  customSelectors: require('postcss-custom-selectors'),
  customProperties: require('postcss-custom-properties'),
  customMedia: require('postcss-custom-media'),
  apply: require('postcss-apply'),
  import: require('postcss-import'),
}

const DefinePlugin = webpack.DefinePlugin

const ENV_NAMES = [
  'NODE_ENV',
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_STORAGE_BUCKET',
  'STRIPE_PUBLISHABLE_KEY',
  'PAYMENT_API_ENDPOINT',
  'ORANGESYS_API_ENDPOINT',
  'SENTRY_DSN',
  'SUPPORT_EMAIL',
  'GA_TRACKING_ID',
  'API_DEBUG_MODE',
]

module.exports = {
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    './src/index.js',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    port: 4000,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.ejs',
      chunkSortMode: 'dependency',
      hash: false,
      inject: 'body',
      gaTrackingId: process.env.GA_TRACKING_ID,
    }),
    new DefinePlugin(envDefinitions()),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/, /variables\.css$/],
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader?modules' },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  postcss.autoprefixer,
                  postcss.import,
                  postcss.customProperties(),
                  postcss.customProperties,
                  postcss.customSelectors,
                  postcss.customMedia,
                  postcss.apply,
                ]
              },
            },
          },
        ],
      },
      {
        test: /variables\.css$/,
        loader: 'css-variables-loader',
      },
      {
        test: /\.(jpg|png)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=25000',
      },
    ],
  },
}


function envDefinitions() {
  return ENV_NAMES.reduce((result, current) => (
    Object.assign({}, result, {
      [current]: JSON.stringify(process.env[current]),
    })
  ), {})
}
