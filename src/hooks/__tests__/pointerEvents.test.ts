import { renderHook } from '@testing-library/react-hooks';
import { fireEvent } from '@testing-library/react';

import usePointerEvents from '@/hooks/pointerEvents';
import Keys from '@/lib/keys';

describe('usePointerEvents', () => {
  test('should disable pointer events when a navigation shorcut is pressed', () => {
    renderHook(() => usePointerEvents());

    fireEvent.keyDown(document, { key: Keys.Navigation.Down });

    expect(document.body.style.pointerEvents).toBe('none');
  });

  test('should enable again pointer events after the mouse has moved', () => {
    renderHook(() => usePointerEvents());

    fireEvent.keyDown(document, { key: Keys.Navigation.Down });

    expect(document.body.style.pointerEvents).toBe('none');

    fireEvent.mouseMove(document);

    expect(document.body.style.pointerEvents).toBe('');
  });
});
