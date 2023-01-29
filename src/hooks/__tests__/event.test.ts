import { fireEvent, renderHook } from '@testing-library/react';

import useEvent from '@/hooks/event';

describe('useEvent', () => {
  test('should fire a function when the event is triggered', () => {
    const callback = jest.fn();

    renderHook(() => useEvent('keydown', () => callback()));

    fireEvent.keyDown(document, { key: 'k' });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should add event listener to document', () => {
    Document.prototype.addEventListener = jest.fn();

    renderHook(() => useEvent('keydown', () => 'test'));

    expect(Document.prototype.addEventListener).toHaveBeenCalledTimes(1);
  });

  test('should remove event listener when the hook is unmounted', () => {
    Document.prototype.addEventListener = jest.fn();
    Document.prototype.removeEventListener = jest.fn();

    const { unmount } = renderHook(() => useEvent('keydown', () => 'test'));

    unmount();

    expect(Document.prototype.addEventListener).toHaveBeenCalledTimes(1);
    expect(Document.prototype.removeEventListener).toHaveBeenCalledTimes(1);
  });
});
