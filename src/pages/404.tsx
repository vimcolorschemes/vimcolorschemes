import React from 'react';

import Page from '@/components/page';
import SEO from '@/components/seo';

interface Props {
  location: Location;
}

const NotFoundPage = ({ location }: Props) => {
  return (
    <Page>
      <SEO
        title="404"
        description="vimcolorschemes is the ultimate resource for vim users to find the perfect color scheme for their favorite development environment. Come for the hundreds of vim color schemes, stay for the awesome hjkl spatial navigation."
        pathname={location.pathname}
      />
      <h1>Page not found</h1>
    </Page>
  );
};

export default NotFoundPage;
