const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');

const customSeletors = require('postcss-custom-selectors');
const customProperties = require('postcss-custom-properties');
const customMedia = require('postcss-custom-media');
const apply = require('postcss-apply');
const atImport = require('postcss-import');

// =========================================================
//  ENVIRONMENT VARS
// ---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;

const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION = NODE_ENV === 'production';
const ENV_TEST = NODE_ENV === 'test';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

// =========================================================
//  LOADERS
// ---------------------------------------------------------
const loaders = {
  js: { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
  css: { test: /.css$/, exclude: /node_modules/, loaders: ['style', 'css?modules', 'postcss'] },
  cssFlexboxGrid: { test: /.css$/, include: /flexboxgrid/, loader: 'style!css?modules' },
};

// =========================================================
//  CONFIG
//---------------------------------------------------------
const config = {};
module.exports = config;


config.resolve = {
  extensions: ['', '.js', '.jsx'],
  modulesDirectories: ['node_modules'],
  root: path.resolve('.'),
};

config.plugins = [
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(NODE_ENV),
    FIREBASE_API_KEY: JSON.stringify(FIREBASE_API_KEY),
    FIREBASE_AUTH_DOMAIN: JSON.stringify(FIREBASE_AUTH_DOMAIN),
    FIREBASE_DATABASE_URL: JSON.stringify(FIREBASE_DATABASE_URL),
    FIREBASE_STORAGE_BUCKET: JSON.stringify(FIREBASE_STORAGE_BUCKET),
  }),
];

config.postcss = [
  autoprefixer({ browsers: ['last 3 versions'] }),
  atImport,
  customProperties,
  customSeletors,
  customMedia,
  apply,
];

// =====================================
//  DEVELOPMENT or PRODUCTION
// -------------------------------------
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {
  config.entry = {
    main: ['./src/main.js'],
  };

  config.output = {
    filename: '[name].js',
    path: path.resolve('./target'),
    publicPath: '/',
  };

  config.plugins.push(
    new HtmlWebpackPlugin({
      chunkSortMode: 'dependency',
      filename: 'index.html',
      hash: false,
      inject: 'body',
      template: './src/index.html',
    })
  );
}

// =====================================
//  DEVELOPMENT
// -------------------------------------
if (ENV_DEVELOPMENT) {
  config.devtool = 'cheap-module-source-map';

  config.entry.main.unshift(
    `webpack-dev-server/client?http://${HOST}:${PORT}`,
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    'babel-polyfill'
  );

  config.module = {
    loaders: [
      loaders.js,
      loaders.css,
      loaders.cssFlexboxGrid,
    ],
  };

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );

  config.devServer = {
    contentBase: './src',
    historyApiFallback: true,
    host: HOST,
    hot: true,
    port: PORT,
    publicPath: config.output.publicPath,
    stats: {
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false,
    },
  };
}


// =====================================
//  PRODUCTION
//-------------------------------------
if (ENV_PRODUCTION) {
  config.devtool = 'source-map';

  // config.entry.vendor = './src/vendor.js';

  config.output.filename = '[name].[chunkhash].js';

  config.module = {
    loaders: [
      loaders.js,
      loaders.css,
    ],
  };

  config.plugins.push(
    new WebpackMd5Hash(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        dead_code: true, // eslint-disable-line camelcase
        screw_ie8: true, // eslint-disable-line camelcase
        unused: true,
        warnings: false,
      },
    })
  );
}

// =====================================
//  TEST
// -------------------------------------
if (ENV_TEST) {
  config.devtool = 'inline-source-map';

  config.module = {
    loaders: [
      loaders.js,
      loaders.css,
    ],
  };
}
