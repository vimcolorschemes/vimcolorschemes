import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest';

import ErrorPage from '@/app/error';

vitest.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.ComponentProps<'a'>) => (
    <a href={typeof href === 'string' ? href : ''} {...props}>
      {children}
    </a>
  ),
}));

describe('app error boundary', () => {
  const consoleErrorSpy = vitest
    .spyOn(console, 'error')
    .mockImplementation(() => undefined);

  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the fallback UI', () => {
    render(<ErrorPage error={new Error('boom')} reset={vitest.fn()} />);

    expect(screen.getByText('something went wrong.')).toBeDefined();
    expect(
      screen
        .getByRole('link', { name: 'back to trending' })
        .getAttribute('href'),
    ).toBe('/i/trending');
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it('calls reset when retry is clicked', () => {
    const reset = vitest.fn();

    render(<ErrorPage error={new Error('boom')} reset={reset} />);

    fireEvent.click(screen.getByRole('button', { name: 'try again' }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
