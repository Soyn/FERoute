export const Route = {
  routes: [],
  timer: null,
  config: function (options) {
    this.root = options.root || '/';
    if (options.mode === 'history' && typeof history.pushState === 'function') {
      this.mode = 'history';
    } else {
      this.mode = 'hash';
    }
    return this;
  },
  add: function(path, handler) {
    if (typeof path === 'function') {
      handler = path;
      path = '';  // home page
    }
    this.routes.push({
      path,
      handler,
    });
    return this;
  },
  clearSlash: function (path) {
    return path.replace(/^\//, '').replace(/\/$/, '');
  },
  getFragement: function () {
    let fragement = '';
    if (this.mode === 'history') {
      fragement = location.pathname + location.search;
      fragement = this.clearSlash(fragement);
      fragement = fragement.replace('/\?(.*)$/', '');  // replace the query string
      fragement = this.root !== '/' ? fragement.replace(this.root, '') : fragement;
    } else {
      fragement = location.hash.slice(1);
    }
    return fragement;
  },
  remove: function(param) {
    for(let i = 0; i < this.routes.length; i += 1) {
      const r = this.routes[i];
      if (param === r.handler || param.toString() === r.path) {
        this.routes.splice(i, 1);
        return this;
      }
    }
    return this;
  },
  check: function(f) {
    const fragement = f || this.getFragement();
    for(let i = 0; i < this.routes.length; i+= 1) {
      const r = this.routes[i];
      const match = r.path.match(fragement);
      if (match) {
        r.handler.apply({}, match.slice(1));
        return this;
      }
    }
    return this;
  },
  startTimer: function(fn, ms) {
    const self = this;
    const internalFn = function () {
      fn();
      self.timer = setTimeout(internalFn, ms);
    }
    this.timer = setTimeout(internalFn, ms);
  },
  listen: function () {
    let current = this.getFragement();
    let self = this;
    const fn = function() {
      if (current !== self.getFragement()) {
        current = self.getFragement();
        self.check(current);
      }
    };
    this.startTimer(fn, 50);
    return this;
  },
  navigate: function(path) {
    if (!path) {
      return ;
    }
    if (this.mode === 'history') {
      // keep the path starts with '/' which will not change the host
      history.pushState(null, null, path[0] !== '/' ? '/' + path : path);
    } else {
      location.href += path;
    }
    return this;
  },
  flush: function () {
    this.root = '/';
    this.routes = [];
    this.mode = null;
    this.timer = clearTimeout(this.timer);
    return this;
  }
}
