import {
  BrowserWindow,
  Menu,
  app,
  globalShortcut,
  screen,
} from 'electron';

import config from '../shared/config';
import message from '../shared/message';

import ipc from './ipc';
import tray from './tray';
import overlay from './overlay';
import watcher from './watcher';
import monitor from './monitor';

// remote svc
import gfycat from './gfycat';
import laughterAnalysis from './laughterAnalysis';

const _checked = {};
let _currentUrl = null;
function registerIpc() {
  console.log('registering ipc...');

  // hack, renderer has setinterval that calls check_url every now and then;
  // why renderer? why not?
  ipc.register('async', message.CHECK_URL, (data) => {
    monitor.getUrl().then(url => {
      if (!url) {
        return;
      }
      if (url.indexOf('youtube.com') > -1 &&
          url.indexOf('watch') > -1) {
        // if already checking/checked, do nothing
        if (_checked[url]) return;
        _checked[url] = true;
        _currentUrl = url;

        // we have a youtube url
        // send to backend for analysis
        laughterAnalysis(url).then(result => {
          console.log(`Analyzed:: ${url}`, result.length, result);
          overlay.render('app', { exclusive: true });
          // provide timestamp to frontend
          overlay.send('app', {
            action: message.URL_RESULT,
            data: {
              url,
              result,
            },
          });
        }).catch(err => console.error(err));
      } else {
        // user navigated away from url, stop laughing!!
      }
    });
  });

  ipc.register('async', message.HIDE_APP, (data) => {
      overlay.hide('app');
  });

  ipc.register('async', message.GET_GIF, (data) => {
    // just ignore no longer valid show gifs
    if (data.url !== _currentUrl) return;

    gfycat.search().then(result => {
      console.log('GET_GIF');

      overlay.render('app', { exclusive: true });

      // provide timestamp to frontend
      overlay.send('app', {
        action: message.SHOW_GIF,
        data: result,
      });
    });
  });
}

function delayInit() {
  registerIpc();

  console.log('rendering app');
  overlay.render('app', { exclusive: true });
}

if (!app.shouldQuit) {
  app.shouldQuit = app.makeSingleInstance(() => {});
  if (app.shouldQuit) {
    app.quit()
  }
}

app.commandLine.appendSwitch('enable-transparent-visuals'); // try add this line

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  tray.createTray();

  watcher.registerAll([
    // register monitor
  ]);

  setTimeout(delayInit, config.runtime.DELAY_INIT_MS);

  // Report uncaught exceptions
  process.on('uncaughtException', (err) => {
    const errJSON = {message: err.message, stack: err.stack}
    //TODO: fix this
    //windows.main.dispatch('uncaughtError', 'main', errJSON)
  });
});

app.once('will-finish-launching', () => {
  //crashReporter.init()
});

app.on('browser-window-created', (evt , window) => {
  //window.setMenu(null);
});

app.on('browser-window-blur', (evt, window) => {
});

app.on('browser-window-focus', (evt, window) => {
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
});

app.on('will-quit', () => {
});

app.dock.hide()
console.log('running...');
