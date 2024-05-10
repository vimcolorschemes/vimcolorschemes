import { fireEvent, renderHook } from '@testing-library/react';
import { vitest, describe, it, expect } from 'vitest';

import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';

describe('useKeyboardShortcut', () => {
  it('should fire a function when keydown is detected', () => {
    const shortcut = { k: vitest.fn() };

    renderHook(() => useKeyboardShortcut(shortcut));

    fireEvent.keyDown(document, { key: 'k' });

    expect(shortcut.k).toHaveBeenCalledTimes(1);
  });

  it('should add event listener to document', () => {
    Document.prototype.addEventListener = vitest.fn();

    const shortcut = { k: () => null };

    renderHook(() => useKeyboardShortcut(shortcut));

    expect(Document.prototype.addEventListener).toHaveBeenCalledTimes(1);
  });

  it('should not fire a function when input is focused', () => {
    const shortcut = { k: vitest.fn() };

    const eventTarget = document.createElement('textarea');

    renderHook(() => useKeyboardShortcut(shortcut));

    eventTarget.focus();

    fireEvent.keyDown(eventTarget, { code: 'KeyK' });

    expect(shortcut.k).not.toHaveBeenCalled();
  });

  it('should remove event listener when the hook is unmounted', () => {
    Document.prototype.addEventListener = vitest.fn();
    Document.prototype.removeEventListener = vitest.fn();

    const shortcut = { k: () => null };

    const { unmount } = renderHook(() => useKeyboardShortcut(shortcut));

    unmount();

    expect(Document.prototype.addEventListener).toHaveBeenCalledTimes(1);
    expect(Document.prototype.removeEventListener).toHaveBeenCalledTimes(1);
  });
});
