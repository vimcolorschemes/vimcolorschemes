import React, { useState, useEffect, useRef } from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import { ACTIONS } from "../../constants/actions";
import { URLify } from "../../utils/string";
import { getRepositoryInfos } from "../../utils/repository";

import Card from "../../components/card";
import Grid from "../../components/grid";
import Layout from "../../components/layout";
import Pagination from "../../components/pagination";
import SEO from "../../components/seo";

import "./index.scss";

const RepositoriesPage = ({ data, pageContext, location }) => {
  const [focusIndex, setFocusIndex] = useState();
  const { totalCount, repositories } = data?.repositoriesData;

  const refs = useRef([]);

  const { currentPage, pageCount } = pageContext;

  const currentPath = location.pathname || "";
  const activeAction =
    Object.values(ACTIONS).find(
      action =>
        currentPath.includes(action.route) && action !== ACTIONS.DEFAULT,
    ) || ACTIONS.DEFAULT;

  useEffect(() => {
    const handleKeyPress = event => {
      if (focusIndex == null) {
        setFocusIndex(0);
        return;
      }
      switch (event.key) {
        case "k":
          setFocusIndex(index => (index > 1 ? index - 2 : index));
          break;
        case "l":
          setFocusIndex(index => (index % 2 === 0 ? index + 1 : index));
          break;
        case "j":
          setFocusIndex(index =>
            index < repositories.length - 2 ? index + 2 : index,
          );
          break;
        case "h":
          setFocusIndex(index => (index % 2 !== 0 ? index - 1 : index));
          break;
        default:
          break;
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyPress);

      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [repositories.length, focusIndex]);

  useEffect(() => {
    const focus = index => refs.current[index]?.focus();
    if (focusIndex != null) focus(focusIndex);
  }, [focusIndex, refs]);

  if (totalCount == null || repositories == null) return;

  return (
    <Layout>
      <SEO title={`${activeAction.label} vim color schemes`} />
      <p>{totalCount} repos</p>
      <ul className="actions">
        {Object.values(ACTIONS).map((action, index) => (
          <li key={`${action.route}-${index}`}>
            <Link
              to={action.route}
              className={`actions__button ${
                activeAction === action ? "actions__button--active" : ""
              }`}
            >
              {action.label}
            </Link>
          </li>
        ))}
      </ul>
      <Grid className="repositories">
        {repositories.map((repository, index) => {
          const {
            ownerName,
            name,
            description,
            featuredImage,
          } = getRepositoryInfos(repository);
          const repositoryKey = `${ownerName}/${name}`;
          return (
            <Card
              key={`repository-${repositoryKey}`}
              linkRef={element => {
                refs.current[index] = element;
              }}
              linkTo={`/${URLify(repositoryKey)}`}
              linkState={{ fromPath: currentPath }}
              ownerName={ownerName}
              name={name}
              description={description}
              image={featuredImage}
            />
          );
        })}
      </Grid>
      <br />
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        activeActionRoute={activeAction.route}
      />
    </Layout>
  );
};

RepositoriesPage.propTypes = {
  data: PropTypes.shape({
    repositoriesData: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      repositories: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          stargazersCount: PropTypes.number.isRequired,
          lastCommitAt: PropTypes.string.isRequired,
          createdAt: PropTypes.string.isRequired,
          owner: PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired,
          featuredImage: PropTypes.shape({
            childImageSharp: PropTypes.shape({
              fluid: PropTypes.shape({}).isRequired,
            }).isRequired,
          }),
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
  pageContext: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    skip: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
  }),
};

export const query = graphql`
  query(
    $skip: Int!
    $limit: Int!
    $sortField: [mongodbVimcsRepositoriesFieldsEnum]!
    $sortOrder: [SortOrderEnum]!
  ) {
    repositoriesData: allMongodbVimcsRepositories(
      filter: { blacklisted: { ne: true } }
      sort: { fields: $sortField, order: $sortOrder }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      repositories: nodes {
        name
        description
        stargazersCount: stargazers_count
        lastCommitAt: last_commit_at
        createdAt: github_created_at
        owner {
          name
        }
        featuredImage: processed_featured_image {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;

export default RepositoriesPage;
