function sum() {
  return 1 + 2;
}


test("1 + 2 equals 3", () => {
  expect(sum()).toBe(3);
});
