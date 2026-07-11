import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RepositoriesHeader from '@/components/repositories/header';

describe('RepositoriesHeader', () => {
  it('keeps a spacer between the title and repository count', () => {
    const { container } = render(
      <RepositoriesHeader title="trending" count={31} />,
    );

    expect(
      screen.getByRole('heading', { name: 'trending, 31 repositories' }),
    ).toBeTruthy();
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it('gives search headings natural word boundaries', () => {
    render(
      <RepositoriesHeader title="results for" query="tokyo night" count={1} />,
    );

    expect(
      screen.getByRole('heading', {
        name: 'results for "tokyo night", 1 repository',
      }),
    ).toBeTruthy();
  });
});
