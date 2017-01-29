var path = require('path');
var webpack = require('webpack');

var common = require('./common');

var env = common.env;
var ROOT = common.ROOT;

var sassLoader = [
  'style',
  'css',
  'postcss',
  'sass?sourceMap&outputStyle=expanded&includePaths[]=' + path.resolve('./node_modules'),
].join('!');

module.exports = {
  target: 'electron-renderer',
  watch: env === 'dev',

  entry: {
    app: ['./renderer/app'],
  },
  output: {
    path: env === 'dev' ? path.join(ROOT, '_build') : path.join(ROOT, 'app', 'renderer'),
    publicPath: '',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'css!postcss'
      },
      {
        test: /\.scss$/,
        loader: sassLoader,
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$/,
        loader: 'file'
      },
      {
        test: /.json$/, loader: 'json'
      }
    ],
  },

  externals: Object.assign({}, common.nodeModules, {
    'ace': 'ace',
  }),

  resolve: {
    modulesDirectories: ['renderer', 'shared', 'main.js', 'sass', 'node_modules'],
    extensions: ['', '.js', '.json', '.coffee', '.jsx']
  },

  postcss: function () {
    return [require('autoprefixer')];
  },

  devtool: 'eval-source-map',

  plugins: [
    common.definePlugin,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(new RegExp('^(fs|ipc)$')),
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

