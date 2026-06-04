import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { getEnv } from "../config/env";

const GRAPHQL_URL = `${getEnv("VITE_API_BASE_URL")}/forum/graphql`;

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem("access_token");

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
