class IpcServer {
  constructor(ipcObject) {
    this.asyncMsgHandler = {};
    this.syncMsgHandler = {};
    this.asyncReplyHandler = {};

    this.handler = {
      asyncMsgHandler: this.asyncMsgHandler,
      syncMsgHandler: this.syncMsgHandler,
      asyncReplyHandler: this.asyncReplyHandler,
    };

    this.ipcObject = ipcObject;

    ['async', 'sync'].forEach(type => {
      this.ipcObject.on(`${type}hronous-message`, (event, msg) => {
        const { action, data } = msg;
        const handlerType = `${type}MsgHandler`;

        if (this.handler[handlerType][action]) {
          this.handler[handlerType][action](data, event);
        } else {
          console.warn(`${type} message not handled:: `, msg);
        }
      });
    });

    this.ipcObject.on('pingx', (event, msg) => {
      console.log('ping: ', event, msg);
      const { action, data } = msg;
      if (this.handler['asyncReplyHandler'][action]) {
        this.handler[handlerType][action](data, event);
      } else {
        console.warn('async reply not handled:: ', msg);
      }
    });
  }

  register(type, action, fn) {
    const handlerType = `${type}MsgHandler`;
    this.handler[handlerType][action] = fn;
  }

  deregister(type, action) {
    const handlerType = `${type}MsgHandler`;
    delete this.handler[handlerType][action];
  }

  registerAsyncReply(action, fn) {
    this.handler['asyncReplyHandler'][action] = fn;
  }

  deregisterAysncReply(action) {
    delete this.handler['asyncReplyHandler'][action];
  }

  send(type, msg) {
    console.info('Sending: ', type, msg);
    this.ipcObject.send(type, msg);
  }
}

export default function getIpcServer(ipcObject) {
  return new IpcServer(ipcObject);
}
