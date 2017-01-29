require('babel-polyfill');

global.Promise = require('bluebird');
require('./mainjs');
