import { Route } from '../src/lib/route';

beforeEach(() => {
  Route.flush();
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

