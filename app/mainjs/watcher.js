const WATCH_INTERVAL_MS = 999;

const Watcher = {
  _interval: null,
  _register: { },

  watching: true,

  toggleWatch() {
    Watcher.watching = !Watcher.watching;
    for (let key of Object.keys(Watcher._register)) {
      const obj = Watcher._register[key];
      obj.watchToggle(Watcher.watching);
    }
  },
  registerWatch(obj) {
    Watcher._register[obj.name] = obj;
  },
  deregisterWatch(obj) {
    delete Watcher._register[obj.name];
  },
  registerAll(cbs) {
    cbs.forEach(cb => Watcher.registerWatch(cb));

    Watcher._interval = setInterval(() => {
      for (let key of Object.keys(Watcher._register)) {
        const obj = Watcher._register[key];
        if (Watcher.watching) {
          try {
            obj.watchUpdate();
          } catch (e) {
            console.warn(`${obj.name} watchUpdate exception:: ${e}`);
          }
        }
      }
    }, WATCH_INTERVAL_MS);
  },
};

export default Watcher;
