var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

console.log('Process: ', process.env);
var definePlugin = new webpack.DefinePlugin({
  __PROD__: JSON.stringify(JSON.parse(process.env.PROD || 'false')),
});

var env = process.env.ENV || 'dev';
var ROOT = path.join(__dirname, '..');

var nodeModules = { };
// note the path.resolve(__dirname, ...) part
// without it, eslint-import-resolver-webpack fails
// since eslint might be invoked with different cwd
fs.readdirSync(path.resolve(__dirname, '../node_modules'))
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

module.exports = {
  nodeModules,
  definePlugin,
  env,
  ROOT,
};
