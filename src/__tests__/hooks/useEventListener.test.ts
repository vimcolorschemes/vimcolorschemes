import { cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vitest } from 'vitest';

import { useEventListener } from '@/hooks/useEventListener';

describe('useEventListener', () => {
  afterEach(cleanup);

  it('forwards document events to the callback', () => {
    const callback = vitest.fn();

    renderHook(() => useEventListener<KeyboardEvent>('keydown', callback));

    fireEvent.keyDown(document, { key: 'k' });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('forwards events to the current callback after rerendering', () => {
    const firstCallback = vitest.fn();
    const currentCallback = vitest.fn();
    const { rerender } = renderHook(
      ({ callback }) => useEventListener<KeyboardEvent>('keydown', callback),
      { initialProps: { callback: firstCallback } },
    );

    rerender({ callback: currentCallback });
    fireEvent.keyDown(document, { key: 'k' });

    expect(firstCallback).not.toHaveBeenCalled();
    expect(currentCallback).toHaveBeenCalledTimes(1);
  });

  it('stops forwarding events after unmounting', () => {
    const callback = vitest.fn();
    const { unmount } = renderHook(() =>
      useEventListener<KeyboardEvent>('keydown', callback),
    );

    unmount();
    fireEvent.keyDown(document, { key: 'k' });

    expect(callback).not.toHaveBeenCalled();
  });
});
