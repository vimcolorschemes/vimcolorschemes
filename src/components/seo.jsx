import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

function SEO({ description, lang, meta, title, imageURL, path }) {
  const { site, logo } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            siteUrl
            description
            author
          }
        }
        logo: file(relativePath: { eq: "logo_background.png" }) {
          publicURL
        }
      }
    `,
  );

  const metaDescription = description || site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:url`,
          content: `${site.siteMetadata.siteUrl}${path}`,
        },
        {
          property: `og:image`,
          content: `${site.siteMetadata.siteUrl}${imageURL || logo.publicURL}`,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          property: `twitter:image`,
          content: `${site.siteMetadata.siteUrl}${logo.publicURL}`,
        },
      ].concat(meta)}
    />
  );
}

SEO.defaultProps = {
  lang: "en",
  meta: [],
  description: "",
  path: "",
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  imageURL: PropTypes.string,
  path: PropTypes.string,
};

export default SEO;
