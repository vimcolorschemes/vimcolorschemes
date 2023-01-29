import { fireEvent, renderHook } from '@testing-library/react';

import useShortcut from '@/hooks/shortcut';

describe('useShortcut', () => {
  test('should fire a function when keydown is detected', () => {
    const shortcut = { k: jest.fn() };

    renderHook(() => useShortcut(shortcut));

    fireEvent.keyDown(document, { key: 'k' });

    expect(shortcut.k).toHaveBeenCalledTimes(1);
  });

  test('should add event listener to document', () => {
    Document.prototype.addEventListener = jest.fn();

    const shortcut = { k: () => null };

    renderHook(() => useShortcut(shortcut));

    expect(Document.prototype.addEventListener).toHaveBeenCalledTimes(1);
  });

  test('should not fire a function when input is focused', () => {
    const shortcut = { k: jest.fn() };

    const eventTarget = document.createElement('textarea');

    renderHook(() => useShortcut(shortcut));

    eventTarget.focus();

    fireEvent.keyDown(eventTarget, { code: 'KeyK' });

    expect(shortcut.k).not.toHaveBeenCalled();
  });

  test('should remove event listener when the hook is unmounted', () => {
    Document.prototype.addEventListener = jest.fn();
    Document.prototype.removeEventListener = jest.fn();

    const shortcut = { k: () => null };

    const { unmount } = renderHook(() => useShortcut(shortcut));

    unmount();

    expect(Document.prototype.addEventListener).toHaveBeenCalledTimes(1);
    expect(Document.prototype.removeEventListener).toHaveBeenCalledTimes(1);
  });
});
