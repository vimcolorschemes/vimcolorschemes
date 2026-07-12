import type { RefObject } from 'react';

import { useEventListener } from '@/hooks/useEventListener';

type KeyboardShortcuts = { [key: string]: (event: KeyboardEvent) => void };
type KeyboardShortcutOptions = {
  ownerRef?: RefObject<Element | null>;
};

function getOpenDialog(target: EventTarget | null): HTMLDialogElement | null {
  return target instanceof Element
    ? target.closest<HTMLDialogElement>('dialog[open]')
    : null;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const { tagName, type } = target as HTMLInputElement;

  return (
    (tagName === 'INPUT' &&
      !['submit', 'reset', 'checkbox', 'radio'].includes(type)) ||
    tagName === 'TEXTAREA' ||
    tagName === 'SELECT' ||
    target.closest('[contenteditable]:not([contenteditable="false"])') != null
  );
}

/**
 * Hook to configure keyboard shortcuts.
 *
 * @example
 * useKeyboardShortcut({ b: () => toggleBackground(), c: () => toggleColor() });
 *
 * @param shortcuts The object configuring various shortcuts
 * @param options Options controlling where shortcuts can fire
 */
function useKeyboardShortcut(
  shortcuts: KeyboardShortcuts,
  { ownerRef }: KeyboardShortcutOptions = {},
) {
  useEventListener<KeyboardEvent>('keydown', event => {
    const eventDialog = getOpenDialog(event.target);
    const ownerDialog = getOpenDialog(ownerRef?.current ?? null);

    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      isEditableTarget(event.target) ||
      eventDialog !== ownerDialog ||
      (event.target instanceof Element && event.target.closest('[role="menu"]'))
    ) {
      return;
    }

    shortcuts?.[event.key]?.(event);
  });
}

export default useKeyboardShortcut;
