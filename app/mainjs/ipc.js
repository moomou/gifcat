import {ipcMain} from 'electron';

import getIpcServer from '../shared/getIpcServer';

const ipcServer = getIpcServer(ipcMain);

export default ipcServer;
