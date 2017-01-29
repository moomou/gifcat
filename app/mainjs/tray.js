import {
  BrowserWindow,
  Menu,
  Tray,
  app,
  nativeImage,
} from 'electron';

import config from '../shared/config';

const menuImg = nativeImage.createFromPath(config.icons.menu);

let trayState = true;
let tray = null;

function quit() {
  app.quit();
}

function getContextMenu(updateAvailable) {
  const contextMenu = [ {label: 'Quit', type: 'normal', click: quit}, ];
  return Menu.buildFromTemplate(contextMenu);
}

const TrayManager = {
  createTray() {
    if (tray) return;
    console.log('Trayhere::', config.icons.menu);
    tray = new Tray(menuImg);
    tray.setToolTip('g');
    tray.setContextMenu(getContextMenu());
  },
};

export default TrayManager;
