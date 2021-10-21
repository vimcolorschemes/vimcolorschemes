import React from 'react';
import { Link } from 'gatsby';

import Routes from '@/lib/routes';

import IconLogo from '@/components/icons/logo';

import './index.scss';

interface Props {
  isHome?: boolean;
  isFooter?: boolean;
}

function HomeLink({ isHome, isFooter }: Props) {
  const Title = isFooter ? 'span' : isHome ? 'h1' : 'h2';

  return (
    <Link to={Routes.Home} className="home-link" data-focusable>
      <IconLogo className="home-link__logo" />
      <Title className="home-link__title">
        <span>vim</span>
        <span>colorschemes</span>
      </Title>
    </Link>
  );
}

export default HomeLink;
