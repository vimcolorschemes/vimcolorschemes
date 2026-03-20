import { Link } from '@tanstack/react-router';

export default function Header() {
  return (
    <header>
      <nav>
        <p>
          <Link to="/">vimcolorschemes</Link>
        </p>
        <p>
          <Link to="/">Home</Link> | <Link to="/about">About</Link>
        </p>
      </nav>
    </header>
  );
}
