const root = 'http://www.xxx.com';
const location = {
  href: root,
  pathname: '',
};
module.exports = {
  location,
  history: {
    pushstate: function(state, title, pathname) {
      location.href += '/' + pathname;
      location.pathname = pathname
    },
  }
}