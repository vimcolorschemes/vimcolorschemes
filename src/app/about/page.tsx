import { Metadata } from 'next';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'about',
};

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <h1>About vimcolorschemes</h1>
      <p>
        vimcolorschemes is a small constellation of projects working on the
        common goal of building the ultimate resource for vim and neovim users
        to find the perfect color scheme for their development environment.
      </p>
      <p>
        The focus is on the content. The simple design of the website make the
        colorschemes the focal point of every page. Speed and accessibility are
        also part of the core mission of vimcolorschemes.
      </p>

      <h2>Get involved</h2>
      <p>
        vimcolorschemes is aimed to be a collaborative project, and you are
        invited to help. All types of involvement are welcome!
      </p>
      <p>
        Developers, check out the{' '}
        <a
          href="https://docs.vimcolorschemes.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          development guide
        </a>{' '}
        to start coding.
      </p>

      <h2>Issues</h2>
      <p>
        Having issues with this website? Or do you have a game changing feature
        idea?
      </p>
      <p>
        <a
          href="https://github.com/vimcolorschemes/vimcolorschemes/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bugs and feature requests are welcome.
        </a>{' '}
        Make sure to follow the issue template before posting.
      </p>

      <h2>Is your colorscheme not showing up?</h2>
      <p>
        vimcolorschemes scans Github every day looking for new colorschemes to
        feature.
      </p>
      <p>
        Make sure your colorscheme has <strong>at least 1 star</strong>, and
        words like &ldquo;vim&rdquo;, &ldquo;neovim&rdquo; and at least one of
        the following keywords appear on the README or description:
      </p>
      <ul>
        <li>theme</li>
        <li>color scheme</li>
        <li>colour scheme</li>
        <li>colorscheme</li>
        <li>colourscheme</li>
      </ul>
      <p>
        Still nothing? Feel free to{' '}
        <a
          href="https://github.com/vimcolorschemes/vimcolorschemes/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          create an issue on the Github repository.
        </a>
      </p>

      <h2>Credits</h2>
      <p>All credit goes to the creators of colorschemes around Github. 🌞</p>
    </main>
  );
}
