import React from "react";
import { useState, useRef } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useLoadMore } from "react-load-more-hook";
import { SEARCH_REPOSITORIES } from "../queries/queries";
import Repo from "./Repo";

const Repos = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [username, setUsername] = useState(null);
  const [loadedAll, setLoadedAll] = useState(false);
  const ref = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useLoadMore(() => {
    loadMore();
  }, ref);

  const { loading, error, data, fetchMore } = useQuery(SEARCH_REPOSITORIES, {
    variables: { username: username, countPerPage: 10 },
    skip: username === null,
  });

  const searchRepos = (e) => {
    if (searchKeyword.length > 0) {
      setUsername(searchKeyword);
      setLoadedAll(false);
    }
  };
  
  const loadMore = () => {
    if (
      !data ||
      !data.user ||
      data.user.repositories.repos.length === 0 ||
      loadedAll
    ) {
      setIsLoadingMore(false);
      return;
    }

    fetchMore({
      query: SEARCH_REPOSITORIES,
      variables: {
        username: username,
        countPerPage: 10,
        cursor:
          data.user.repositories.repos[data.user.repositories.repos.length - 1]
            .cursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setIsLoadingMore(false);
        if (fetchMoreResult.user.repositories.repos.length === 0) {
          setLoadedAll(true);
          return prev;
        }
        return {
          user: {
            repositories: {
              repos: [
                ...prev.user.repositories.repos,
                ...fetchMoreResult.user.repositories.repos,
              ],
              __typename: prev.user.repositories.__typename,
            },
            __typename: prev.user.__typename,
          },
        };
      },
    });
  };

  const renderRepoList = () => {
    if (loading) return <p className="loading">Loading...</p>;

    if (error) {
      let message = error.graphQLErrors[0].message;
      if (error.graphQLErrors[0].type === "NOT_FOUND") {
        message = "User not found.";
      } else {
        message = error.graphQLErrors[0].message;
      }
      return <p className="error">{message}</p>;
    }

    if (!data || !data.user.repositories || !data.user.repositories.repos) {
      return <div></div>;
    }
    console.log(data);
    return data.user.repositories.repos.map(({ repo }) => (
      <Repo key={repo.id} repo={repo} />
    ));
  };

  const renderLoadingMore = () => {
    if (isLoadingMore && !loadedAll) {
      return <div className="loading-more">Loading More...</div>;
    }
    return null;
  };
  console.log(data);
  return (
    <div data-testid="repos">
      <div className="search">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          data-testid="input"
        />
        <button onClick={searchRepos} data-testid="button">
          Search
        </button>
      </div>
      <ul className="repos" ref={ref}>
        {renderRepoList()}
        {renderLoadingMore()}
      </ul>
    </div>
  );
};

export default Repos;
