import { paginateRoute } from "src/utils/pagination";

test("paginateRoute with undefined or null values", () => {
  expect(paginateRoute(null, null)).toBe("/");
});
