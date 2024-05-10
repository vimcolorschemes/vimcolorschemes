import { fireEvent, renderHook } from '@testing-library/react';
import { vitest, describe, it, expect } from 'vitest';

import useEventListener from '@/hooks/useEventListener';

describe('useEvent', () => {
  it('should fire a function when the event is triggered', () => {
    const callback = vitest.fn();

    renderHook(() => useEventListener('keydown', () => callback()));

    fireEvent.keyDown(document, { key: 'k' });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should add event listener to document', () => {
    Document.prototype.addEventListener = vitest.fn();

    renderHook(() => useEventListener('keydown', () => 'test'));

    expect(Document.prototype.addEventListener).toHaveBeenCalledTimes(1);
  });

  it('should remove event listener when the hook is unmounted', () => {
    Document.prototype.addEventListener = vitest.fn();
    Document.prototype.removeEventListener = vitest.fn();

    const { unmount } = renderHook(() =>
      useEventListener('keydown', () => 'test'),
    );

    unmount();

    expect(Document.prototype.addEventListener).toHaveBeenCalledTimes(1);
    expect(Document.prototype.removeEventListener).toHaveBeenCalledTimes(1);
  });
});
