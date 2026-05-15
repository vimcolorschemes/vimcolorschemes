import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RepositoryCommand from '@/components/repositoryCommand';

const navigation = vi.hoisted(() => ({
  pathname: '/r/folke/tokyonight.nvim',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.ComponentProps<'a'>) => (
    <a href={typeof href === 'string' ? href : ''} {...props}>
      {children}
    </a>
  ),
}));

describe('RepositoryCommand', () => {
  beforeEach(() => {
    navigation.pathname = '/r/folke/tokyonight.nvim';
    document.body.innerHTML = '';
  });

  it('uses owner and repository name from repository routes', () => {
    render(<RepositoryCommand />);

    expect(screen.getByLabelText('Repository command').textContent).toContain(
      'getfolke/tokyonight.nvim',
    );
  });

  it('uses explicit owner and repository name before the path', () => {
    navigation.pathname = '/r/wrong/repo';

    render(<RepositoryCommand owner="catppuccin" name="nvim" />);

    expect(screen.getByLabelText('Repository command').textContent).toContain(
      'getcatppuccin/nvim',
    );
  });
});
