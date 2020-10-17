import { getFirstProcessedImage } from "src/utils/repository";

const validProcessedImage = {
  childImageSharp: {
    fluid: {
      base64: "",
      aspectRatio: 1,
      src: "",
      srcSet: "",
      srcSetType: "",
      sizes: "",
      originalImg: "",
    },
  },
};

test("getFirstProcessedImage with undefined or null values", () => {
  expect(getFirstProcessedImage(null, null)).toBe(null);
  expect(getFirstProcessedImage(null, undefined)).toBe(null);
  expect(getFirstProcessedImage(undefined, null)).toBe(null);
  expect(getFirstProcessedImage(undefined, undefined)).toBe(null);
});

test("getFirstProcessedImage with wrongly typed values", () => {
  expect(getFirstProcessedImage(1, null)).toBe(null);
  expect(getFirstProcessedImage("", null)).toBe(null);
  expect(getFirstProcessedImage([], null)).toBe(null);
  expect(getFirstProcessedImage(null, validProcessedImage)).toBe(null);
  expect(getFirstProcessedImage(null, 1)).toBe(null);
  expect(getFirstProcessedImage(null, "")).toBe(null);
});

test("getFirstProcessedImage with invalid values", () => {
  expect(getFirstProcessedImage({}, null)).toBe(null);
  expect(getFirstProcessedImage(null, [])).toBe(null);
  expect(getFirstProcessedImage({}, [])).toBe(null);
  expect(getFirstProcessedImage({}, [{}])).toBe(null);
  expect(getFirstProcessedImage({}, [{ childImageSharp: {} }])).toBe(null);
  expect(
    getFirstProcessedImage({ childImageSharp: {} }, [{ childImageSharp: {} }]),
  ).toBe(null);
});

test("getFirstProcessedImage with valid featured image and empty images", () => {
  const expectedImage = validProcessedImage.childImageSharp.fluid;
  expect(getFirstProcessedImage(validProcessedImage, [])).toStrictEqual(
    expectedImage,
  );
  expect(getFirstProcessedImage(validProcessedImage, null)).toStrictEqual(
    expectedImage,
  );
});

test("getFirstProcessedImage with valid featured image and valid images", () => {
  const expectedImage = validProcessedImage.childImageSharp.fluid;
  const closeImageCopy = { ...validProcessedImage, aspectRatio: 2 };
  expect(
    getFirstProcessedImage(validProcessedImage, [closeImageCopy]),
  ).toStrictEqual(expectedImage);
  expect(
    getFirstProcessedImage(validProcessedImage, [
      closeImageCopy,
      closeImageCopy,
    ]),
  ).toStrictEqual(expectedImage);
});

test("getFirstProcessedImage with invalid featured image and valid images", () => {
  const closeImageCopy = { ...validProcessedImage, aspectRatio: 2 };
  const expectedImage = closeImageCopy.childImageSharp.fluid;
  expect(getFirstProcessedImage(null, [closeImageCopy])).toStrictEqual(
    expectedImage,
  );
  expect(getFirstProcessedImage({}, [closeImageCopy])).toStrictEqual(
    expectedImage,
  );
  expect(
    getFirstProcessedImage({ childImageSharp: {} }, [closeImageCopy]),
  ).toStrictEqual(expectedImage);
});

test("getFirstProcessedImage with invalid featured image and multiple valid images", () => {
  const closeImageCopy1 = { ...validProcessedImage, aspectRatio: 2 };
  const closeImageCopy2 = { ...validProcessedImage, aspectRatio: 3 };
  const expectedImage = validProcessedImage.childImageSharp.fluid;

  expect(
    getFirstProcessedImage(null, [
      validProcessedImage,
      closeImageCopy1,
      closeImageCopy2,
    ]),
  ).toStrictEqual(expectedImage);
});
