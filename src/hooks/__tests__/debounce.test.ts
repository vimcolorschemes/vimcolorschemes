import { act } from 'react-test-renderer';
import { renderHook } from '@testing-library/react-hooks';

import useDebounce from '@/hooks/debounce';

describe('useDebounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('should initialize debounced value with default value', () => {
    const defaultValue = 'default value';

    const { result } = renderHook(() => useDebounce(defaultValue));

    expect(result.current).toBe(defaultValue);
  });

  it('should not update debounced value before delay', () => {
    const defaultValue = 'default value';
    const newValue = 'new value';

    const { result, rerender } = renderHook(() => useDebounce(defaultValue));

    rerender(newValue);

    expect(result.current).toBe(defaultValue);
  });

  it('should update debounced value after specified delay', async () => {
    const defaultValue = 'default value';
    const newValue = 'new value';

    const delay = 500;

    const useDebounceHook = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: defaultValue, delay },
      },
    );

    useDebounceHook.rerender({ value: newValue, delay });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(useDebounceHook.result.current).toBe(defaultValue);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(useDebounceHook.result.current).toBe(newValue);
  });
});
