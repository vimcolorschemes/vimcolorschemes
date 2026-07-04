import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RepositoriesHeader from '@/components/repositories/header';

describe('RepositoriesHeader', () => {
  it('keeps a spacer between the title and repository count', () => {
    const { container } = render(
      <RepositoriesHeader title="trending" count={31} />,
    );

    expect(
      screen.getByRole('heading', { name: /trending31 repositories/ }),
    ).toBeTruthy();
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});
