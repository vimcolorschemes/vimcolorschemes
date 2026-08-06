import { cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vitest } from 'vitest';

import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';

describe('useKeyboardShortcut', () => {
  afterEach(() => {
    cleanup();
    vitest.restoreAllMocks();
  });

  it('should fire a function when keydown is detected', () => {
    const shortcut = { k: vitest.fn() };

    renderHook(() => useKeyboardShortcut(shortcut));

    fireEvent.keyDown(document, { key: 'k' });

    expect(shortcut.k).toHaveBeenCalledTimes(1);
  });

  it('fires the current shortcut after rerendering', () => {
    const firstShortcut = vitest.fn();
    const currentShortcut = vitest.fn();
    const { rerender } = renderHook(
      ({ shortcut }) => useKeyboardShortcut({ k: shortcut }),
      { initialProps: { shortcut: firstShortcut } },
    );

    rerender({ shortcut: currentShortcut });
    fireEvent.keyDown(document, { key: 'k' });

    expect(firstShortcut).not.toHaveBeenCalled();
    expect(currentShortcut).toHaveBeenCalledTimes(1);
  });

  it('does not fire when a local handler prevented the event', () => {
    const shortcut = { k: vitest.fn() };
    const eventTarget = document.createElement('button');
    eventTarget.addEventListener('keydown', event => event.preventDefault());
    document.body.append(eventTarget);

    renderHook(() => useKeyboardShortcut(shortcut));

    fireEvent.keyDown(eventTarget, { key: 'k' });

    expect(shortcut.k).not.toHaveBeenCalled();
  });

  it('does not fire while text input is being composed', () => {
    const shortcut = { k: vitest.fn() };

    renderHook(() => useKeyboardShortcut(shortcut));

    fireEvent.keyDown(document, { key: 'k', isComposing: true });

    expect(shortcut.k).not.toHaveBeenCalled();
  });

  it('should not fire a function when input is focused', () => {
    const shortcut = { k: vitest.fn() };

    const eventTarget = document.createElement('textarea');

    renderHook(() => useKeyboardShortcut(shortcut));

    eventTarget.focus();

    fireEvent.keyDown(eventTarget, { code: 'KeyK' });

    expect(shortcut.k).not.toHaveBeenCalled();
  });

  it.each(['input', 'textarea', 'select'])(
    'does not fire a shortcut from a %s',
    tagName => {
      const shortcut = { k: vitest.fn() };
      const eventTarget = document.createElement(tagName);
      document.body.append(eventTarget);

      renderHook(() => useKeyboardShortcut(shortcut));

      fireEvent.keyDown(eventTarget, { key: 'k' });

      expect(shortcut.k).not.toHaveBeenCalled();
    },
  );

  it('does not fire a shortcut from editable content', () => {
    const shortcut = { k: vitest.fn() };
    const editable = document.createElement('div');
    const eventTarget = document.createElement('span');
    editable.setAttribute('contenteditable', 'true');
    editable.append(eventTarget);
    document.body.append(editable);

    renderHook(() => useKeyboardShortcut(shortcut));

    fireEvent.keyDown(eventTarget, { key: 'k' });

    expect(shortcut.k).not.toHaveBeenCalled();
  });

  it('does not fire a page shortcut from an open dialog', () => {
    const shortcut = { k: vitest.fn() };
    const dialog = document.createElement('dialog');
    const eventTarget = document.createElement('button');
    dialog.setAttribute('open', '');
    dialog.append(eventTarget);
    document.body.append(dialog);

    renderHook(() => useKeyboardShortcut(shortcut));

    fireEvent.keyDown(eventTarget, { key: 'k' });

    expect(shortcut.k).not.toHaveBeenCalled();
  });

  it('fires a shortcut owned by the open dialog', () => {
    const shortcut = { k: vitest.fn() };
    const dialog = document.createElement('dialog');
    const eventTarget = document.createElement('button');
    const owner = document.createElement('div');
    dialog.setAttribute('open', '');
    dialog.append(eventTarget, owner);
    document.body.append(dialog);
    const ownerRef = { current: owner };

    renderHook(() => useKeyboardShortcut(shortcut, { ownerRef }));

    fireEvent.keyDown(eventTarget, { key: 'k' });

    expect(shortcut.k).toHaveBeenCalledTimes(1);
  });

  it('does not fire a shortcut owned by another open dialog', () => {
    const shortcut = { k: vitest.fn() };
    const eventDialog = document.createElement('dialog');
    const ownerDialog = document.createElement('dialog');
    const eventTarget = document.createElement('button');
    const owner = document.createElement('div');
    eventDialog.setAttribute('open', '');
    ownerDialog.setAttribute('open', '');
    eventDialog.append(eventTarget);
    ownerDialog.append(owner);
    document.body.append(eventDialog, ownerDialog);
    const ownerRef = { current: owner };

    renderHook(() => useKeyboardShortcut(shortcut, { ownerRef }));

    fireEvent.keyDown(eventTarget, { key: 'k' });

    expect(shortcut.k).not.toHaveBeenCalled();
  });

  it('fires an owned shortcut outside a dialog', () => {
    const shortcut = { k: vitest.fn() };
    const eventTarget = document.createElement('button');
    const owner = document.createElement('div');
    document.body.append(eventTarget, owner);
    const ownerRef = { current: owner };

    renderHook(() => useKeyboardShortcut(shortcut, { ownerRef }));

    fireEvent.keyDown(eventTarget, { key: 'k' });

    expect(shortcut.k).toHaveBeenCalledTimes(1);
  });

  it('does not fire after the hook is unmounted', () => {
    const shortcut = { k: vitest.fn() };

    const { unmount } = renderHook(() => useKeyboardShortcut(shortcut));

    unmount();
    fireEvent.keyDown(document, { key: 'k' });

    expect(shortcut.k).not.toHaveBeenCalled();
  });
});
