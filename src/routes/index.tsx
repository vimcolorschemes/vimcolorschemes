import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App });

function App() {
  return (
    <main>
      <h1>vimcolorschemes</h1>
      <p>TanStack Start migration in progress.</p>
      <ul>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/catppuccin/nvim">Example repository page</a>
        </li>
      </ul>
    </main>
  );
}
