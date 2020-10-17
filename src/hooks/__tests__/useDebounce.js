import { renderHook } from "@testing-library/react-hooks";

import { useDebounce } from "src/hooks/useDebounce";

const sleep = async (delay = 200) =>
  await new Promise(r => setTimeout(r, delay));

describe("useDebounce", () => {
  it("should initialize debounced value with default value", () => {
    const defaultValue = "default value";

    const { result } = renderHook(() => useDebounce(defaultValue));

    expect(result.current).toBe(defaultValue);
  });

  it("should not update debounced value immediately", () => {
    const defaultValue = "default value";
    const newValue = "new value";

    const { result, rerender } = renderHook(() => useDebounce(defaultValue));

    rerender(newValue);

    expect(result.current).toBe(defaultValue);
  });

  it("should update debounced value after delay", async () => {
    const defaultValue = "default value";
    const newValue = "new value";

    const useDebounceHook = renderHook(value => useDebounce(value), {
      initialProps: defaultValue,
    });

    useDebounceHook.rerender(newValue);

    await sleep(200);

    expect(useDebounceHook.result.current).toBe(newValue);
  });

  it("should update debounced value after specified delay", async () => {
    const defaultValue = "default value";
    const newValue = "new value";

    const delay = 500;

    const useDebounceHook = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: defaultValue, delay },
      },
    );

    useDebounceHook.rerender({ value: newValue, delay });

    await sleep(200);

    expect(useDebounceHook.result.current).toBe(defaultValue);

    await sleep(300);

    expect(useDebounceHook.result.current).toBe(newValue);
  });
});
