import electron from 'electron';
import path from 'path';

import config from '../shared/config';
import message, {type as MessageType} from '../shared/message';

const {
  BrowserWindow,
  Menu,
  Tray,
  globalShortcut,
  clipboard,
} = electron;

const rendererConfig = config.renderer;
const refs = { };

function _getPath(name, rawUrl) {
  let htmlPath;

  if (name && rawUrl) {
    return rawUrl;
  }

  if (config.runtime.IS_PROD) {
    htmlPath = 'file://' + path.join(__dirname, 'renderer', name + '.html');
  } else {
    htmlPath = 'file://' + path.join(__dirname, name + '.html');
  }

  return htmlPath;
}

function calculateDim(specDim, screenDim) {
  if (specDim === 0) {
    return screenDim;
  }
  return specDim < 0 && (screenDim + specDim) || specDim;
}

function createWindow(refName, winConfig={}, options={}) {
  if (!refs[refName]) {
    const {workAreaSize} = electron.screen.getPrimaryDisplay();

    const dimension = {
      width: calculateDim(winConfig.dimension.width, workAreaSize.width),
      height: calculateDim(winConfig.dimension.height, workAreaSize.height),
    };

    refs[refName] = new BrowserWindow(Object.assign({}, dimension, {
      acceptFirstMouse: true,
      frame: false,
      movable: false,
      resizable: false,
      show: false,
      transparent: true,
      hasShadow: false,
    }, winConfig.window));

    refs[refName].name = refName;
    refs[refName].setMenu(null);
    refs[refName].loadURL(_getPath(winConfig.name, winConfig.url));

    refs[refName].on('close', (evt) => {
      if (!appState.shouldQuit) {
        evt.preventDefault();
        refs[refName].hide();
      }
    });

    refs[refName].on('closed', () => {
      refs[refName].removeAllListeners();
      refs[refName] = null;
    });

    refs[refName].setVisibleOnAllWorkspaces(true);
    console.log('Rendering ' + winConfig.name);

    refs[refName].openDevTools({ detach: true });
  }

  if (winConfig.position) {
    console.log(`Moving ${refName} to ${JSON.stringify(winConfig.position)}`);
    refs[refName].setPosition(
      parseInt(winConfig.position.x, 10),
      parseInt(winConfig.position.y, 10));
  }
}

const overlay = {
  _renderState: {
    rendering: false,
  },
  inflight() {
    return overlay._renderState.rendering;
  },
  render(name, options={}) {
    const { warmOnly, exclusive } = options;
    const {workAreaSize} = electron.screen.getPrimaryDisplay();

    createWindow(name, rendererConfig[name], { warmOnly });

    if (warmOnly) return;
    if (exclusive) {
      Object.keys(refs).forEach(wName => {
        if (wName !== name) {
          refs[wName].hide();
        }
      });
    }

    overlay._renderState.rendering = true;

    const p = new Promise((resolve, reject) => {
      setImmediate(() => {
        refs[name].show();
        refs[name].focus();
        overlay._renderState.rendering = false;
        resolve();
      });
    });

    return p;
  },
  hide(name) {
    refs[name].hide();
  },
  send(name, msg) {
    const window = refs[name];
    window.webContents.send('asynchronous-message', msg);
  },
  isVisible(name, props) {
    const window = refs[name];
    return window && window.isVisible();
  },
  getVisible() {
    const keys = Object.keys(refs).filter(w => refs[w].isVisible());
    if (keys.length) {
      return refs[keys[0]];
    }
    return {};
  },
};

export default overlay;
