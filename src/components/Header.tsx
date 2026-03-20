import { Link } from '@tanstack/react-router';

export default function Header() {
  return (
    <header className="border-b border-border/70">
      <nav className="mx-auto flex w-full max-w-[80rem] items-center px-4 py-4 md:px-8">
        <p className="text-sm font-semibold tracking-tight">
          <Link to="/">vimcolorschemes</Link>
        </p>
      </nav>
    </header>
  );
}
