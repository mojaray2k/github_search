jest.mock("react-load-more-hook", () => ({
  useLoadMore: () => [false, (loadingMore) => {}],
}));


import React from "react";
import App from "./App";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { SEARCH_REPOSITORIES } from "./queries/queries";

const mocks = [
  {
    request: {
      query: SEARCH_REPOSITORIES,
      variables: { username: "testuser", countPerPage: 10 },
      skip: false
    },
    result: {
      data: {
        user: {
          repositories: {
            repos: [
              {
                repo: {
                  id: "MDEwOlJlcG9zaXRvcnk1OTY2OTg0OQ==",
                  name: "Repo 1",
                  owner: { login: "user1", __typename: "User" },
                  url: "url1",
                  primaryLanguage: {
                    color: "#b07219",
                    name: "Java",
                    __typename: "Language",
                  },
                  watchers: { totalCount: 2, __typename: "UserConnection" },
                  description: "Example project.",
                  __typename: "Repository",
                },
                cursor: "Y3Vyc29yOnYyOpHOA459WQ==",
                __typename: "RepositoryEdge",
              },
              {
                repo: {
                  id: "MDEwOlJlcG9zaXRvcnk1OTY2OTg0OQ==",
                  name: "Repo 1",
                  owner: { login: "user1", __typename: "User" },
                  url: "url1",
                  primaryLanguage: {
                    color: "#b07219",
                    name: "Java",
                    __typename: "Language",
                  },
                  watchers: { totalCount: 2, __typename: "UserConnection" },
                  description: "Example project.",
                  __typename: "Repository",
                },
                cursor: "Y3Vyc29yOnYyOpHOA459WQ==",
                __typename: "RepositoryEdge",
              },
            ],
            __typename: "RepositoryConnection",
          },
          __typename: "User",
        },
      },
    },
  },
];

const renderApp = () =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

afterEach(() => {
  cleanup();
});

test("initial UI is rendered as expected", async () => {
  let { getByTestId, queryByTestId, queryAllByTestId } = renderApp();
  expect(getByTestId('app')).toBeTruthy();
  expect(getByTestId('repos')).toBeTruthy();
  expect(queryByTestId('repo')).toBe(null);
});

test("search button searches the result", async () => {
  let { getByTestId, queryByTestId, queryAllByTestId } = renderApp();
  const input = getByTestId('input');
  const button = getByTestId('button');
  fireEvent.input(input, {
    target: { value: 'testuser'}
  });

  fireEvent.click(button);

  await new Promise(resolve => setTimeout(resolve, 0)); 
  
});