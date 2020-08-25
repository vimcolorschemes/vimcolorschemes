import { getFirstProcessedFluidImage } from "../repository";

const validProcessedFluidImage = {
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

test("getFirstProcessedFluidImage with undefined or null values", () => {
  expect(getFirstProcessedFluidImage(null, null)).toBe(null);
  expect(getFirstProcessedFluidImage(null, undefined)).toBe(null);
  expect(getFirstProcessedFluidImage(undefined, null)).toBe(null);
  expect(getFirstProcessedFluidImage(undefined, undefined)).toBe(null);
});

test("getFirstProcessedFluidImage with wrongly typed values", () => {
  expect(getFirstProcessedFluidImage(1, null)).toBe(null);
  expect(getFirstProcessedFluidImage("", null)).toBe(null);
  expect(getFirstProcessedFluidImage([], null)).toBe(null);
  expect(getFirstProcessedFluidImage(null, validProcessedFluidImage)).toBe(
    null,
  );
  expect(getFirstProcessedFluidImage(null, 1)).toBe(null);
  expect(getFirstProcessedFluidImage(null, "")).toBe(null);
});

test("getFirstProcessedFluidImage with invalid values", () => {
  expect(getFirstProcessedFluidImage({}, null)).toBe(null);
  expect(getFirstProcessedFluidImage(null, [])).toBe(null);
  expect(getFirstProcessedFluidImage({}, [])).toBe(null);
  expect(getFirstProcessedFluidImage({}, [{}])).toBe(null);
  expect(getFirstProcessedFluidImage({}, [{ childImageSharp: {} }])).toBe(null);
  expect(
    getFirstProcessedFluidImage({ childImageSharp: {} }, [
      { childImageSharp: {} },
    ]),
  ).toBe(null);
});

test("getFirstProcessedFluidImage with valid featured image and empty images", () => {
  const expectedFluidImage = validProcessedFluidImage.childImageSharp.fluid;
  expect(
    getFirstProcessedFluidImage(validProcessedFluidImage, []),
  ).toStrictEqual(expectedFluidImage);
  expect(
    getFirstProcessedFluidImage(validProcessedFluidImage, null),
  ).toStrictEqual(expectedFluidImage);
});

test("getFirstProcessedFluidImage with valid featured image and valid images", () => {
  const expectedFluidImage = validProcessedFluidImage.childImageSharp.fluid;
  const closeImageCopy = { ...validProcessedFluidImage, aspectRatio: 2 };
  expect(
    getFirstProcessedFluidImage(validProcessedFluidImage, [closeImageCopy]),
  ).toStrictEqual(expectedFluidImage);
  expect(
    getFirstProcessedFluidImage(validProcessedFluidImage, [
      closeImageCopy,
      closeImageCopy,
    ]),
  ).toStrictEqual(expectedFluidImage);
});

test("getFirstProcessedFluidImage with invalid featured image and valid images", () => {
  const closeImageCopy = { ...validProcessedFluidImage, aspectRatio: 2 };
  const expectedFluidImage = closeImageCopy.childImageSharp.fluid;
  expect(getFirstProcessedFluidImage(null, [closeImageCopy])).toStrictEqual(
    expectedFluidImage,
  );
  expect(getFirstProcessedFluidImage({}, [closeImageCopy])).toStrictEqual(
    expectedFluidImage,
  );
  expect(
    getFirstProcessedFluidImage({ childImageSharp: {} }, [closeImageCopy]),
  ).toStrictEqual(expectedFluidImage);
});

test("getFirstProcessedFluidImage with invalid featured image and multiple valid images", () => {
  const closeImageCopy1 = { ...validProcessedFluidImage, aspectRatio: 2 };
  const closeImageCopy2 = { ...validProcessedFluidImage, aspectRatio: 3 };
  const expectedFluidImage = validProcessedFluidImage.childImageSharp.fluid;

  expect(
    getFirstProcessedFluidImage(null, [
      validProcessedFluidImage,
      closeImageCopy1,
      closeImageCopy2,
    ]),
  ).toStrictEqual(expectedFluidImage);
});
