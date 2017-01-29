var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var common = require('./common');

var ROOT = common.ROOT;
var env = common.env;

module.exports = {
  target: 'electron',
  watch: env === 'dev',

  entry: {
    main: ['./bootstrap.js'],
  },
  output: {
    path: env === 'dev' ? path.join(ROOT, '_build') : path.join(ROOT, 'app'),
    publicPath: '',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$/,
        loader: 'file'
      },
      {
        test: /.json$/, loader: 'json'
      },
    ],
  },

  externals: common.nodeModules,

  resolve: {
    modulesDirectories: ['renderer', 'shared', 'main.js', 'sass', 'node_modules'],
    extensions: ['', '.js', '.json', '.coffee', '.jsx']
  },

  postcss: function () {
    return [require('autoprefixer')];
  },

  devtool: 'eval-source-map',
  node: {
    __dirname: false,
    __filename: false,
  },

  plugins: [
    common.definePlugin,
    new webpack.HotModuleReplacementPlugin(),
    // TODO: figure why this broke fs
    //new webpack.IgnorePlugin(new RegExp('^(fs|ipc)$')),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.WatchIgnorePlugin([
      path.resolve(__dirname, './node_modules/'),
      path.resolve(__dirname, './_*/'),
    ]),
  ],

  cacheable: false,
  debug: true,
};

