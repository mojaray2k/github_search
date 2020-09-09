import { gql } from "apollo-boost";

const SEARCH_REPOSITORIES = gql`
  query($username: String!, $countPerPage: Int, $cursor: String) {
    user(login: $username) {
      repositories(
        after: $cursor,
        first: $countPerPage
      ) {
        repos: edges {
          repo: node {
            ... on Repository {
              id
              name
              owner {
                login
              }
              url
              primaryLanguage {
                color
                name
              }
              watchers {
                totalCount
              }
              description
            }
          }
          cursor
        }
      }
    }
  }
`;

export { SEARCH_REPOSITORIES };
