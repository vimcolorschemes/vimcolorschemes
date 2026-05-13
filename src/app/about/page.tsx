import { Metadata } from 'next';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'about',
};

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <article className={styles.manual}>
        <header className={styles.manHeader}>
          <span>VIMCOLORSCHEMES(7)</span>
        </header>

        <section className={styles.section} aria-labelledby="name">
          <h1 id="name">NAME</h1>
          <p>
            <strong>vimcolorschemes</strong> - a focused catalog of Vim and
            Neovim color schemes
          </p>
        </section>

        <section className={styles.section} aria-labelledby="description">
          <h2 id="description">DESCRIPTION</h2>
          <p>
            vimcolorschemes helps Vim and Neovim users find color schemes that
            fit their editor, terminal, and taste.
          </p>
          <p>
            The site keeps the interface quiet so the themes stay in focus: fast
            browsing, accessible pages, useful previews, and direct links back
            to the people building the work.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="get-involved">
          <h2 id="get-involved">GET INVOLVED</h2>
          <p>
            vimcolorschemes is a collaborative project. Feedback, code,
            documentation, design ideas, and theme suggestions are welcome.
          </p>
          <p>
            Developers can start with the{' '}
            <a
              href="https://docs.vimcolorschemes.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              development guide
            </a>
            .
          </p>
        </section>

        <section className={styles.section} aria-labelledby="issues">
          <h2 id="issues">ISSUES</h2>
          <p>
            Found a bug, missing theme, broken preview, or confusing detail?
            Open an issue on GitHub so it can be tracked.
          </p>
          <p>
            Feature requests are welcome too. Please use the{' '}
            <a
              href="https://github.com/vimcolorschemes/vimcolorschemes/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              issue tracker
            </a>{' '}
            and follow the template when posting.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="featured">
          <h2 id="featured">FEATURED</h2>
          <p>
            Featured color schemes are hand-picked. If you maintain a great
            theme and want to support the project while getting it in front of
            more people, send an email to{' '}
            <a href="mailto:hey@reobin.dev">hey@reobin.dev</a>.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="discovery">
          <h2 id="discovery">DISCOVERY</h2>
          <p>
            vimcolorschemes scans GitHub every day for color schemes to include.
          </p>
          <p>
            If your color scheme is not showing up, make sure the repository has{' '}
            <strong>at least 1 star</strong>. The README or description should
            mention &ldquo;vim&rdquo; or &ldquo;neovim&rdquo;, plus at least one
            of these keywords:
          </p>
          <ul>
            <li>theme</li>
            <li>color scheme</li>
            <li>colour scheme</li>
            <li>colorscheme</li>
            <li>colourscheme</li>
          </ul>
          <p>
            Still nothing?{' '}
            <a
              href="https://github.com/vimcolorschemes/vimcolorschemes/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Create an issue on GitHub
            </a>{' '}
            and include a link to the repository.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="project">
          <h2 id="project">PROJECT</h2>
          <p>
            Source code, issues, and feature requests live on{' '}
            <a
              href="https://github.com/vimcolorschemes/vimcolorschemes"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            . The long-term aim is a useful, fast, and trustworthy archive of
            Vim color scheme work.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="credits">
          <h2 id="credits">CREDITS</h2>
          <p>
            All credit goes to the creators of color schemes around GitHub.
            vimcolorschemes exists to make their work easier to find, compare,
            and enjoy.
          </p>
        </section>

        <footer className={styles.manFooter}>
          <span>vimcolorschemes</span>
        </footer>
      </article>
    </main>
  );
}
