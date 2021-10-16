import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import useNavigation from '@/hooks/navigation';

/*
 * Note: Very basic testing is possible here because the
 * spatial-navigation-polyfill requires layouting, which is not implemented in
 * JSDOM
 */

describe('useNavigation', () => {
  beforeAll(() => {
    require('spatial-navigation-polyfill');
    Document.prototype.elementFromPoint = jest.fn(() => null);
  });

  test('should focus on first focusable element at beginning', () => {
    document.body.innerHTML = `
      <div>
        <button>nothing</button>
        <button id="first" data-focusable>first</button>
        <button id="second" data-focusable>second</button>
      </div>
    `;

    const first = document.getElementById('first');

    renderHook(() => useNavigation());

    fireEvent.keyDown(global.document.documentElement, { key: 'j' });

    expect(global.document.activeElement).toBe(first);
  });

  test('should focus on second element after two down presses', () => {
    document.body.innerHTML = `
      <div>
        <button>nothing</button>
        <button id="first" data-focusable>first</button>
        <button id="second" data-focusable>second</button>
      </div>
    `;

    const first = document.getElementById('first');
    const second = document.getElementById('second');

    renderHook(() => useNavigation());

    fireEvent.keyDown(global.document.documentElement, { key: 'j' });

    expect(global.document.activeElement).toBe(first);

    fireEvent.keyDown(global.document.documentElement, { key: 'j' });

    expect(global.document.activeElement).toBe(second);
  });
});
