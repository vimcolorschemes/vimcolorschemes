import React from 'react';

import Page from '@/components/page';
import SEO from '@/components/seo';

interface Props {
  location: Location;
}

const NotFoundPage = ({ location }: Props) => {
  return (
    <Page>
      <SEO title="404" pathname={location.pathname} />
      <h1>Page not found</h1>
    </Page>
  );
};

export default NotFoundPage;
