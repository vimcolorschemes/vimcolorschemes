import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <main>
      <h1>About vimcolorschemes</h1>
      <p>
        This branch is migrating the website from Next.js to TanStack Start.
      </p>
    </main>
  );
}
