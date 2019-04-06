import { Route } from '../src';
jest.useFakeTimers();
beforeEach(() => {
  Route.flush();
  Route.config({
    root: 'http://www.test.com',
    mode: 'history',
  });
});
test('Config Route', () => {
  Route.config({
    mode: 'history',
    root: 'http://www.test.com',
  });
  expect(Route.mode).toEqual('history');
  expect(Route.root).toEqual('http://www.test.com');
});
test("Add one route to Route", () => {
  Route.add('test', () => {});
  expect(Route.routes.length).toEqual(1);
});

test("Remove route", () => {
  Route.add('test');
  Route.remove('test1');
  expect(Route.routes.length).toEqual(1);

  Route.remove('test');
  expect(Route.routes.length).toEqual(0);
});

test("Navigate", () => {
  global.history.pushState = jest.fn();
  Route.navigate('/test');
  expect(global.history.pushState).toHaveBeenCalled();
});

test("getFragement will be called 21 times after 1 second", () => {
  Route.getFragement = jest.fn(() => '123')
  Route.listen();
  expect(Route.getFragement).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(1000);
  expect(Route.getFragement).toHaveBeenCalledTimes(21);
});

test("Called on specfic path", () => {
  const fn1 = jest.fn();
  const fn2 = jest.fn();

  Route.add('/api/documents/123', fn1);
  Route.add('/search/wet', fn2);

  Route.check('/api/documents/123');
  expect(fn1).toHaveBeenCalled();
  expect(fn1).toHaveBeenCalledTimes(1)

  Route.check('/search/wet');
  Route.check('/search/wet');
  expect(fn2).toHaveBeenCalled();
  expect(fn2).toHaveBeenCalledTimes(2);

});

test("Flush config", () => {
  Route.flush();
  expect(Route.root).toEqual('/');
  expect(Route.routes.length).toEqual(0);
  expect(Route.mode).toEqual(null);
  expect(Route.timer).toEqual(undefined);

});
