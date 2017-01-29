import electron from 'electron';
import path from 'path';
import { spawn, execFile } from 'child_process';

import gconfig from '../shared/config';
import * as fsUtil from './fsUtil';

const userDataPath = electron.app.getPath('userData');

const PLATFORM = {
  'mac' :{
    'bin': 'sh',
    'parameters': [
      `${userDataPath}/scripts/mac.sh`,
      `${userDataPath}/scripts/urlWatcher.scpt`,
      1, 0
    ],
  },
};

let setupPromise = null;
function ensureSetup() {
  if (!setupPromise) {
    setupPromise = fsUtil.copyToDataPath(path.join(gconfig.runtime.ROOT, 'vendor', 'scripts'), 'scripts').then(() => {
      const scriptsPath = path.join(userDataPath, 'scripts');
    }).then(() => null);
  }
  return setupPromise;
}

function getScriptConfig() {
  let config;
  switch (process.platform) {
    case 'darwin':
      config = PLATFORM.mac;
      break;
    default:
      throw `Operating System not supported yet. ${process.platform}`;
  }

  // Append directory to script url
  if (config.script_url) {
    const script_url = path.join(userDataPath, config.script_url);
    console.log('I GOT THIS::', config.script_url);
    config.parameters.push(script_url);
  }
  // Append directory to subscript url on OSX
  //if (process.platform === 'darwin') {
    //config.parameters.push(path.join(userDataPath, config.subscript_url));
  //}

  return config;
}

async function register(callback, repeats, interval) {
    await ensureSetup();

    interval = (interval) ? interval : 0;
    repeats = (repeats) ? repeats : 1;

    const parameters = scriptConfig.parameters;

    // Run script
    const ls = spawn(scriptConfig.bin, parameters);
    ls.stdout.setEncoding('utf8');

    // Obtain successful response from script
    ls.stdout.on('data', function(stdout){
      const str = stdout.toString();
      callback(str);
    });

    // Obtain error response from script
    ls.stderr.on('data', function(stderr){
      console.log('???::', str);
      throw stderr.toString();
    });

    ls.stdin.end();
}

const scriptConfig = getScriptConfig();

export default {
  async setup() {
    await ensureSetup();
  },

  async register(...args) {
    return register(...args);
  },

  getUrl() {
    return Promise.race([
      new Promise(resolve => {
        register(result => resolve(result));
      }),
      Promise.delay(2500).then(() => {}),
    ]);
  },
};
