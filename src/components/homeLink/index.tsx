import React from 'react';
import { Link } from 'gatsby';

import LocalStorageHelper from '@/helpers/localStorage';
import LocalStorageKeys from '@/lib/localStorage';
import Routes from '@/lib/routes';

import IconLogo from '@/components/icons/logo';

import './index.scss';

interface Props {
  isHome?: boolean;
  isFooter?: boolean;
  onClick?: () => void;
}

function HomeLink({ isHome, isFooter, onClick }: Props) {
  const Title = isFooter ? 'span' : isHome ? 'h1' : 'h2';

  return (
    <Link
      to={Routes.Home}
      className="home-link"
      onClick={() => {
        LocalStorageHelper.remove(LocalStorageKeys.SearchInput);
        LocalStorageHelper.remove(LocalStorageKeys.SearchPage);

        if (onClick) {
          onClick();
        }
      }}
      data-focusable
    >
      <IconLogo className="home-link__logo" />
      <Title className="home-link__title">
        <span>vim</span>
        <span>colorschemes</span>
      </Title>
    </Link>
  );
}

export default HomeLink;
