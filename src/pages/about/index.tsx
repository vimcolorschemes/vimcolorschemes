import React from 'react';

import ExternalLink from '@/components/externalLink';
import Page from '@/components/page';
import SEO from '@/components/seo';

import './index.scss';
import Routes from '@/lib/routes';

interface Props {
  location: Location;
}

const AboutPage = ({ location }: Props) => {
  return (
    <Page className="about">
      <SEO
        title="About"
        description="vimcolorschemes is the ultimate resource for vim users to find the perfect color scheme for their favorite development environment. Come for the hundreds of vim color schemes, stay for the awesome hjkl spatial navigation."
        pathname={location.pathname}
      />

      <h1 className="title" id="about">
        <a href="#about" data-focusable>
          About vimcolorschemes
        </a>
      </h1>
      <p>
        vimcolorschemes is a small constellation of projects working on the
        common goal of building the <strong>ultimate resource</strong> for vim
        users to find the <strong>perfect color scheme</strong> for their
        development environment.
      </p>
      <p>
        The <strong>focus</strong> here is always on the{' '}
        <strong>content</strong>. The <strong>simple design</strong> of the
        website make the color schemes the focal point of every page.{' '}
        <strong>Speed</strong> and <strong>accessibility</strong> are also part
        of the core mission of <strong>vimcolorschemes</strong>.
      </p>
      <h2 className="subtitle" id="key-features">
        <a href="#key-features" data-focusable>
          Key features{' '}
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </a>
      </h2>
      <ul>
        <li>
          <strong>Daily updated</strong> list of hundreds of vim color scheme
          repositories
        </li>
        <li>
          <strong>Awesome vim (or arrows) key bindings</strong> to navigate
          quickly through the whole site
        </li>
      </ul>

      <h2 className="subtitle" id="get-involved">
        <a href="#get-involved" data-focusable>
          Get Involved
        </a>
      </h2>
      <p>
        <strong>vimcolorschemes</strong> is aimed to be a collaborative project,
        and you are invited to help. All types of involvement are welcome!
      </p>
      <p>
        Developers, check out{' '}
        <ExternalLink to={Routes.Docs} className="inline-link" data-focusable>
          the development guide{' '}
        </ExternalLink>
        to start writing code.
      </p>
      <h2 className="subtitle" id="issues">
        <a href="#issues" data-focusable>
          Issues
        </a>
      </h2>
      <p>
        Having issues with this website? Or do you have a game changing feature
        idea?
      </p>
      <p>
        <ExternalLink to={Routes.Issues} className="inline-link" data-focusable>
          Bugs and feature requests{' '}
        </ExternalLink>
        are welcome. Make sure to follow the issue template before posting.
      </p>
      <h2 className="subtitle" id="howto">
        <a href="#trouble" data-focusable>
          Is your vim color scheme not showing up?
        </a>
      </h2>
      <p>
        <strong>vimcolorschemes</strong> scans GitHub every day looking for new
        color schemes to feature.
      </p>
      <p>
        Make sure the word <strong>vim</strong> and at least one of the
        following keywords appear on the <strong> README </strong> or{' '}
        <strong> description</strong>:
      </p>
      <ul>
        <li>theme</li>
        <li>color scheme</li>
        <li>colour scheme</li>
        <li>colorscheme</li>
        <li>colourscheme</li>
      </ul>
      <blockquote>
        <em>Note:</em> The words can be in any order. Example: "color scheme for
        vim" will work.
      </blockquote>
      <p>
        Still nothing? Feel free to{' '}
        <ExternalLink to={Routes.Issues} className="inline-link" data-focusable>
          create an issue on the GitHub repository.
        </ExternalLink>
      </p>
      <h2 className="subtitle" id="credits">
        <a href="#credits" data-focusable>
          Credits
        </a>
      </h2>
      <p>
        Credit goes to all the creators of vim color schemes around GitHub{' '}
        <span role="img" aria-label="celebration">
          🎉
        </span>
      </p>
    </Page>
  );
};

export default AboutPage;
