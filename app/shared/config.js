import path from 'path';
import electron from 'electron';

const ROOT = (electron.app && electron.app.getAppPath()) || null;
const GLOBAL = typeof process !== 'undefined' ? process : window;
const IS_PROD = __PROD__;

if (!ROOT) {
  console.log('Unable to launch due to missing app root');
}

const APP_NAME = 'g';
const APP_VERSION = '0.0.0';

const config = {
  APP_NAME,
  APP_VERSION,

  runtime: {
    IS_PROD,
    ROOT,
    DELAY_INIT_MS: 300,
  },

  rpc: {
    isLaughter: {
      serverUrl: 'https://api.ohsloth.com/isLaughter',
    },
  },

  icons: {
    menu: path.join(ROOT, '_assets', 'icon.png'),
  },

  renderer: {
    app: {
      name: 'app',
      dimension: {
        width: 500,
        height: 500,
      },
      position: {
        x: 800,
        y: 0,
      },
    },
  },
};

module.exports = config;
