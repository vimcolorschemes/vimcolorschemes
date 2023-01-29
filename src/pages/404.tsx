import React from 'react';

import Page from '@/components/page';
import SEO from '@/components/seo';

const NotFoundPage = () => {
  return (
    <Page>
      <h1>Page not found</h1>
    </Page>
  );
};

export default NotFoundPage;

interface HeadProps {
  location: Location;
}

export function Head({ location }: HeadProps) {
  return <SEO title="404" pathname={location.pathname} />;
}
