import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Helmet } from 'react-helmet';

import './index.scss';

interface Props {
  title: string;
  description: string;
  pathname: string;
  og?: {
    image?: string;
  };
}

function SEO({ title, description, pathname, og }: Props) {
  const { site, logo } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            siteUrl
          }
        }
        logo: file(relativePath: { eq: "logo_background.png" }) {
          publicURL
        }
      }
    `,
  );

  const image = useMemo(() => {
    const path = !!og?.image ? og.image : logo.publicURL;
    return site.siteMetadata.siteUrl + path;
  }, [og?.image, logo, site.siteMetadata.siteUrl]);

  return (
    <Helmet
      htmlAttributes={{ lang: 'en' }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: 'description',
          content: description,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:url',
          content: `${site.siteMetadata.siteUrl}${pathname}`,
        },
        {
          property: 'og:image',
          content: image,
        },
        {
          property: 'og:image:type',
          content: 'image/png',
        },
        {
          property: 'og:image:width',
          content: '400',
        },
        {
          property: 'og:image:height',
          content: '200',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:creator',
          content: '@reobindev',
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: description,
        },
        {
          name: 'twitter:image',
          content: image,
        },
      ]}
    />
  );
}

export default SEO;
