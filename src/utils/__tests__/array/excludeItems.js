import { excludeItems } from "src/utils/array";

test("excludeItems with undefined or null values", () => {
  expect(excludeItems(null, null)).toStrictEqual([]);
  expect(excludeItems(undefined, undefined)).toStrictEqual([]);
  expect(excludeItems(null, undefined)).toStrictEqual([]);
  expect(excludeItems(undefined, null)).toStrictEqual([]);
});

test("excludeItems with invalid values", () => {
  expect(excludeItems({}, {})).toStrictEqual([]);
  expect(excludeItems({}, 1)).toStrictEqual([]);
  expect(excludeItems({}, "")).toStrictEqual([]);
  expect(excludeItems({}, [])).toStrictEqual([]);

  expect(excludeItems(1, {})).toStrictEqual([]);
  expect(excludeItems(1, 1)).toStrictEqual([]);
  expect(excludeItems(1, "")).toStrictEqual([]);
  expect(excludeItems(1, [])).toStrictEqual([]);

  expect(excludeItems("", {})).toStrictEqual([]);
  expect(excludeItems("", 1)).toStrictEqual([]);
  expect(excludeItems("", "")).toStrictEqual([]);
  expect(excludeItems("", [])).toStrictEqual([]);

  expect(excludeItems([], {})).toStrictEqual([]);
  expect(excludeItems([], 1)).toStrictEqual([]);
  expect(excludeItems([], "")).toStrictEqual([]);
});

test("excludeItems with empty values", () => {
  expect(excludeItems([], [])).toStrictEqual([]);
});

test("excludeItems with no excluded items", () => {
  expect(excludeItems([1, 2, 3], [])).toStrictEqual([1, 2, 3]);
  expect(excludeItems([1, 2], [])).toStrictEqual([1, 2]);
});

test("excludeItems with excluded items but no items to actually exclude", () => {
  expect(excludeItems([1, 2, 3], [5, 6])).toStrictEqual([1, 2, 3]);
  expect(excludeItems([1, 2], ["", {}])).toStrictEqual([1, 2]);
});

test("excludeItems with items to exclude items", () => {
  expect(excludeItems([1, 2, 3], [1, 2])).toStrictEqual([3]);
  expect(excludeItems([1, 2], [2])).toStrictEqual([1]);
});

test("excludeItems with items to exclude items and items not to exclude", () => {
  expect(excludeItems([1, 2, 3], [1, 2, 5])).toStrictEqual([3]);
  expect(excludeItems([1, 2], [2, ""])).toStrictEqual([1]);
});
