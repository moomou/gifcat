import electron from 'electron';
import path from 'path';

const fs = Promise.promisifyAll(require('fs-extra'));
const userDataPath = electron.app.getPath('userData');

export function ensureDir(dir) {
  return fs.ensureDirAsync(dir);
}

export async function copyToDataPath(srcPath, dstDir) {
  await fs.ensureDirAsync(path.join(userDataPath, dstDir));
  return fs.copyAsync(srcPath, path.join(userDataPath, dstDir || ''));
}

export async function setFilePermission(path, permission='755') {
  return fs.chmodAsync(path, permission);
}
