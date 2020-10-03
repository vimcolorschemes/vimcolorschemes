import { convertColonEmojis } from "src/utils/emoji";

test("convertColonEmojis with null or undefined value", () => {
  expect(convertColonEmojis(null)).toBe("");
  expect(convertColonEmojis(undefined)).toBe("");
});

test("convertColonEmojis with invalid value", () => {
  expect(convertColonEmojis(1)).toBe("");
  expect(convertColonEmojis({})).toBe("");
  expect(convertColonEmojis([])).toBe("");
});

test("convertColonEmojis with no colon emojis", () => {
  expect(convertColonEmojis("Test value")).toBe("Test value");
});

test("convertColonEmojis with 1 colon emoji", () => {
  expect(convertColonEmojis("Test value :smile:")).toBe("Test value 😄");
});

test("convertColonEmojis with multiple colon emojis", () => {
  expect(convertColonEmojis("Test value :smile: :boat:")).toBe(
    "Test value 😄 ⛵",
  );
  expect(convertColonEmojis(":package: :smile: :boat:")).toBe("📦 😄 ⛵");
});
