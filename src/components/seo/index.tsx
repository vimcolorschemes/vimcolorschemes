import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import './index.scss';

interface Props {
  title: string;
  pathname: string;
  description?: string;
  image?: string;
}

function SEO({ title, description, pathname, image }: Props) {
  const { site, logo } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            siteUrl
            description
          }
        }
        logo: file(relativePath: { eq: "logo_background.png" }) {
          publicURL
        }
      }
    `,
  );

  const ogImage = useMemo(() => {
    const path = !!image ? image : logo.publicURL;
    return site.siteMetadata.siteUrl + path;
  }, [image, logo, site.siteMetadata.siteUrl]);

  const fullDescription = useMemo(() => {
    if (!description) {
      return site.siteMetadata.description;
    }

    return `${description} | ${site.siteMetadata.description}`;
  }, [description, site.siteMetadata.description]);

  const formattedTitle = useMemo(() => {
    return `${title} | ${site.siteMetadata.title}`;
  }, [title, site.siteMetadata.title]);

  return (
    <>
      <title>{formattedTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`${site.siteMetadata.siteUrl}${pathname}`}
      />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="200" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@reobindev" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}

export default SEO;
