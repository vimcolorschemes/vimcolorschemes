import React from "react";
import classnames from "classnames";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import { RepositoryType } from "../../types";

import { LAYOUTS, SECTIONS } from "../../constants";

import { useNavigation } from "../../hooks/useNavigation";

import { getRepositoryInfos } from "../../utils/repository";

import { Arrow } from "../../components/icons";

import ExternalLink from "../../components/externalLink";
import Layout from "../../components/layout";
import Mosaic from "../../components/mosaic";
import RepositoryTitle from "../../components/repositoryTitle";
import SEO from "../../components/seo";
import ZoomableImage from "../../components/zoomableImage";

import "./index.scss";

const RepositoryPage = ({ data, location }) => {
  const fromPath = location?.state?.fromPath;

  const {
    ownerName,
    name,
    githubUrl,
    featuredImage,
    description,
    images,
  } = getRepositoryInfos(data.repository);

  const {
    siteMetadata: { platform },
  } = data.site;

  useNavigation(SECTIONS.REPOSITORY_MAIN_IMAGE);

  const Nav = ({ bottom }) => (
    <nav
      className={classnames("repository__nav", {
        "repository__nav--bottom": bottom,
      })}
    >
      <Link
        to={fromPath || "/"}
        data-section={
          bottom ? SECTIONS.REPOSITORY_BOTTOM_NAV : SECTIONS.REPOSITORY_NAV
        }
        data-layout={LAYOUTS.LIST}
        className="repository__nav-link"
      >
        <Arrow left className="repository__nav-link-icon" />
        back
      </Link>
    </nav>
  );

  return (
    <Layout>
      <SEO
        title={`${name} ${platform} color scheme, by ${ownerName}`}
        imageUrl={featuredImage?.publicURL}
        path={`/${ownerName}/${name}`}
      />
      <article className="repository">
        <header className="repository__hero">
          <Nav />
          <div className="repository__header">
            <RepositoryTitle ownerName={ownerName} name={name} tag="h1" />
            <ExternalLink
              to={githubUrl}
              data-section={SECTIONS.REPOSITORY_HEADER}
              data-layout={LAYOUTS.LIST}
              className="repository__nav-link"
            >
              GitHub
            </ExternalLink>
          </div>
          <p>{description}</p>
        </header>
        {!!featuredImage && (
          <ZoomableImage
            image={featuredImage}
            alt="featured"
            className="repository__image"
            data-section={SECTIONS.REPOSITORY_MAIN_IMAGE}
            data-layout={LAYOUTS.BLOCK}
          />
        )}
        {!!images && images.length > 0 && <Mosaic images={images} />}
      </article>
      <Nav bottom />
    </Layout>
  );
};

RepositoryPage.propTypes = {
  data: PropTypes.shape({
    repository: RepositoryType,
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        platform: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }),
  location: PropTypes.shape({
    fromPath: PropTypes.string,
  }),
};

export const query = graphql`
  query($ownerName: String!, $name: String!) {
    site {
      siteMetadata {
        platform
      }
    }
    repository: mongodbColorschemesRepositories(
      owner: { name: { eq: $ownerName } }
      name: { eq: $name }
    ) {
      name
      description
      githubUrl: github_url
      stargazersCount: stargazers_count
      lastCommitAt: last_commit_at
      createdAt: github_created_at
      owner {
        name
      }
      featuredImage: processed_featured_image {
        publicURL
        childImageSharp {
          fluid(maxWidth: 1280, quality: 100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      images: processed_images {
        childImageSharp {
          fluid(maxWidth: 1280, quality: 80) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`;

export default RepositoryPage;
