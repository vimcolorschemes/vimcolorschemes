import { getRepositoryInfos, getFirstProcessedFluidImage } from "../repository";

/*
 * Test for getRepositoryInfos
 */

test("getRepositoryInfos with nullable value", () => {
  expect(getRepositoryInfos(null)).toStrictEqual({});
  expect(getRepositoryInfos(undefined)).toStrictEqual({});
  expect(getRepositoryInfos({})).toStrictEqual({});
});

test("getRepositoryInfos with wrongly typed value", () => {
  expect(getRepositoryInfos(1)).toStrictEqual({});
  expect(getRepositoryInfos([])).toStrictEqual({});
  expect(getRepositoryInfos("")).toStrictEqual({});
});

test("getRepositoryInfos adding ownerName", () => {
  const repository = { owner: { name: "test" } };
  expect(getRepositoryInfos(repository)).toStrictEqual({
    ...repository,
    ownerName: "test",
  });
});

test("getRepositoryInfos adding valid date field", () => {
  expect(typeof getRepositoryInfos({ createdAt: new Date() }).createdAt === "string").toBe(true);
  expect(typeof getRepositoryInfos({ lastCommitAt: new Date() }).lastCommitAt === "string").toBe(true);
});

test("getRepositoryInfos adding invalid date field", () => {
  expect(getRepositoryInfos({ createdAt: 1 }).createdAt).toBeFalsy();
  expect(getRepositoryInfos({ createdAt: "" }).createdAt).toBeFalsy();
  expect(getRepositoryInfos({ createdAt: {} }).createdAt).toBeFalsy();
  expect(getRepositoryInfos({ createdAt: null }).createdAt).toBeFalsy();
  expect(getRepositoryInfos({ createdAt: undefined }).createdAt).toBeFalsy();
  expect(getRepositoryInfos({ lastCommitAt: 1 }).createdAt).toBeFalsy();
  expect(getRepositoryInfos({ lastCommitAt: "" }).createdAt).toBeFalsy();
  expect(getRepositoryInfos({ lastCommitAt: {} }).createdAt).toBeFalsy();
  expect(getRepositoryInfos({ lastCommitAt: null }).createdAt).toBeFalsy();
  expect(getRepositoryInfos({ lastCommitAt: undefined }).createdAt).toBeFalsy();
});

/*
 * Tests for getFirstProcessedFluidImage
 */

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
