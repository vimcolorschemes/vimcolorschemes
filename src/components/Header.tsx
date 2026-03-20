import { Link } from '@tanstack/react-router';

import Logo from '#/components/Logo';

export default function Header() {
  return (
    <header className="border-b border-border/70">
      <nav className="mx-auto flex w-full max-w-[80rem] items-center px-4 py-4 md:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <Logo className="h-4 w-4 shrink-0" />
          <span>vimcolorschemes</span>
        </Link>
      </nav>
    </header>
  );
}
