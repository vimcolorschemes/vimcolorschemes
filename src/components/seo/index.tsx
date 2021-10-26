import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Helmet } from 'react-helmet';

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

  return (
    <Helmet
      htmlAttributes={{ lang: 'en' }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: 'description',
          content: fullDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: fullDescription,
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
          content: ogImage,
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
          content: fullDescription,
        },
        {
          name: 'twitter:image',
          content: ogImage,
        },
      ]}
    />
  );
}

export default SEO;
