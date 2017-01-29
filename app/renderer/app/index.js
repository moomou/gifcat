import {ipcRenderer} from 'electron';

import getIpcServer from '../../shared/getIpcServer';
import message, { type as MessageType } from '../../shared/message';

import * as GfycatApp from './gfycat';

import 'file?name=[name].[ext]!./app.html';

const ipcServer = getIpcServer(ipcRenderer);

const app = GfycatApp.init('container', ipcServer);

document.body.addEventListener('click', (evt) => {
  if (evt.target === document.body || evt.target.id.startsWith('container')) {
    ipcServer.send(MessageType.ASYNC, {
      action: message.HIDE,
    });
  }
});

ipcServer.register('async', message.TOGGLE_RENDER_APP, data => {
  const { show } = data;
  if (show) app.show();
  else app.hide();
});
