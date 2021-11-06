import DOMHelper from '@/helpers/dom';

describe('DOMHelper.getExplicitelyFocusableElements', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should return only elements with the data-focusable attribute', () => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('data-focusable', 'true');

    const focusableButton = document.createElement('button');
    focusableButton.type = 'button';
    focusableButton.setAttribute('data-focusable', 'true');

    const nonFocusableButton = document.createElement('button');
    nonFocusableButton.type = 'button';

    document.body.appendChild(input);
    document.body.appendChild(focusableButton);
    document.body.appendChild(nonFocusableButton);

    expect(DOMHelper.getExplicitelyFocusableElements()).toContain(input);
    expect(DOMHelper.getExplicitelyFocusableElements()).toContain(
      focusableButton,
    );
  });

  test('should return empty array if no elements with the data-focusable attribute is found', () => {
    const nonFocusableInput = document.createElement('input');
    nonFocusableInput.type = 'checkbox';

    const nonFocusableButton1 = document.createElement('button');
    nonFocusableButton1.type = 'button';

    const nonFocusableButton2 = document.createElement('button');
    nonFocusableButton2.type = 'button';

    document.body.appendChild(nonFocusableInput);
    document.body.appendChild(nonFocusableButton1);
    document.body.appendChild(nonFocusableButton2);

    expect(DOMHelper.getExplicitelyFocusableElements()).toEqual([]);
  });
});

describe('DOMHelper.isTextInput', () => {
  test('should return false for undefined element', () => {
    expect(DOMHelper.isTextInput(null)).toBe(false);
    expect(DOMHelper.isTextInput(undefined as any)).toBe(false);
  });

  test('should return true for a text input', () => {
    const input = document.createElement('input');
    expect(DOMHelper.isTextInput(input)).toBe(true);

    const textInput = document.createElement('input');
    textInput.type = 'text';
    expect(DOMHelper.isTextInput(textInput)).toBe(true);

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    expect(DOMHelper.isTextInput(searchInput)).toBe(true);
  });

  test('should return true for a textarea', () => {
    const textarea = document.createElement('textarea');
    expect(DOMHelper.isTextInput(textarea)).toBe(true);
  });

  test('should return false for a button', () => {
    const button = document.createElement('button');
    expect(DOMHelper.isTextInput(button)).toBe(false);

    const inputButton = document.createElement('input');
    inputButton.type = 'submit';
    expect(DOMHelper.isTextInput(inputButton)).toBe(false);

    const resetButton = document.createElement('input');
    resetButton.type = 'reset';
    expect(DOMHelper.isTextInput(resetButton)).toBe(false);
  });

  test('should return false for a radio button or checkbox', () => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    expect(DOMHelper.isTextInput(checkbox)).toBe(false);

    const radio = document.createElement('input');
    radio.type = 'radio';
    expect(DOMHelper.isTextInput(radio)).toBe(false);
  });
});

describe('DOMHelper.isInViewport', () => {
  beforeAll(() => {
    global.innerWidth = 500;
    global.innerHeight = 500;
  });

  test('should return true if the element is completely in the viewport', () => {
    const element = document.createElement('div');
    element.getBoundingClientRect = jest.fn(
      () => ({ top: 100, right: 200, bottom: 200, left: 100 } as DOMRect),
    );

    expect(DOMHelper.isInViewport(element)).toBe(true);
  });

  test('should return false if the element is partially outside the viewport', () => {
    const top = document.createElement('div');
    top.getBoundingClientRect = jest.fn(
      () => ({ top: -50, right: 200, bottom: 50, left: 100 } as DOMRect),
    );
    expect(DOMHelper.isInViewport(top)).toBe(false);

    const right = document.createElement('div');
    right.getBoundingClientRect = jest.fn(
      () => ({ top: 100, right: 550, bottom: 200, left: 450 } as DOMRect),
    );
    expect(DOMHelper.isInViewport(right)).toBe(false);

    const bottom = document.createElement('div');
    bottom.getBoundingClientRect = jest.fn(
      () => ({ top: 450, right: 200, bottom: 550, left: 100 } as DOMRect),
    );
    expect(DOMHelper.isInViewport(bottom)).toBe(false);

    const left = document.createElement('div');
    left.getBoundingClientRect = jest.fn(
      () => ({ top: 100, right: 50, bottom: 200, left: -50 } as DOMRect),
    );
    expect(DOMHelper.isInViewport(left)).toBe(false);
  });

  test('should return false if the element is completely outside the viewport', () => {
    const top = document.createElement('div');
    top.getBoundingClientRect = jest.fn(
      () => ({ top: -200, right: 200, bottom: -100, left: 100 } as DOMRect),
    );
    expect(DOMHelper.isInViewport(top)).toBe(false);

    const right = document.createElement('div');
    right.getBoundingClientRect = jest.fn(
      () => ({ top: 100, right: 900, bottom: 200, left: 800 } as DOMRect),
    );
    expect(DOMHelper.isInViewport(right)).toBe(false);

    const bottom = document.createElement('div');
    bottom.getBoundingClientRect = jest.fn(
      () => ({ top: 800, right: 200, bottom: 900, left: 100 } as DOMRect),
    );
    expect(DOMHelper.isInViewport(bottom)).toBe(false);

    const left = document.createElement('div');
    left.getBoundingClientRect = jest.fn(
      () => ({ top: 100, right: -100, bottom: 200, left: -200 } as DOMRect),
    );
    expect(DOMHelper.isInViewport(left)).toBe(false);
  });
});
