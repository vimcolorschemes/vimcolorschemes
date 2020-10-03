import { paginateRoute } from "src/utils/pagination";

test("paginateRoute with undefined or null values", () => {
  expect(paginateRoute(null, null)).toBe("/");
  expect(paginateRoute(undefined, undefined)).toBe("/");
  expect(paginateRoute(null, undefined)).toBe("/");
  expect(paginateRoute(undefined, null)).toBe("/");
});

test("paginateRoute with invalid values", () => {
  expect(paginateRoute({}, {})).toBe("/");
  expect(paginateRoute([], [])).toBe("/");
  expect(paginateRoute({}, [])).toBe("/");
  expect(paginateRoute([], {})).toBe("/");
  expect(paginateRoute(1, "")).toBe("/");
  expect(paginateRoute(1, {})).toBe("/");
  expect(paginateRoute(1, [])).toBe("/");
  expect(paginateRoute({}, "")).toBe("/");
  expect(paginateRoute([], "")).toBe("/");
});

test("paginateRoute with non-positive page", () => {
  expect(paginateRoute({}, 0)).toBe("/");
  expect(paginateRoute({}, -1)).toBe("/");
  expect(paginateRoute([], 0)).toBe("/");
  expect(paginateRoute([], -1)).toBe("/");
  expect(paginateRoute(1, 0)).toBe("/");
  expect(paginateRoute(1, -1)).toBe("/");
  expect(paginateRoute("", 0)).toBe("");
  expect(paginateRoute("", -1)).toBe("");
  expect(paginateRoute("about", 0)).toBe("about");
  expect(paginateRoute("about", -1)).toBe("about");
  expect(paginateRoute("/about", -1)).toBe("/about");
});

test("paginateRoute with route but null or undefined page", () => {
  expect(paginateRoute("/about", null)).toBe("/about");
  expect(paginateRoute("/about", undefined)).toBe("/about");
});

test("paginateRoute with page but null or undefined route", () => {
  expect(paginateRoute(null, 1)).toBe("/");
  expect(paginateRoute(undefined, 2)).toBe("/page/2");
});

test("paginateRoute with route and page", () => {
  expect(paginateRoute("repositories", 1)).toBe("repositories");
  expect(paginateRoute("repositories", 2)).toBe("repositories/page/2");
});

test("paginateRoute with route and page with leading forward slash", () => {
  expect(paginateRoute("/repositories", 1)).toBe("/repositories");
  expect(paginateRoute("/repositories", 2)).toBe("/repositories/page/2");
});

test("paginateRoute with route and page with leading route", () => {
  expect(paginateRoute("/options/repositories", 1)).toBe(
    "/options/repositories",
  );
  expect(paginateRoute("/options/repositories", 2)).toBe(
    "/options/repositories/page/2",
  );
});

test("paginateRoute with route and page with trailing route", () => {
  expect(paginateRoute("/options/repositories/", 1)).toBe(
    "/options/repositories/",
  );
  expect(paginateRoute("/options/repositories/", 2)).toBe(
    "/options/repositories/page/2",
  );
});
