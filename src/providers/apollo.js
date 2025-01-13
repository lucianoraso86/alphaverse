import { ApolloProvider as AProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL,
  cache: new InMemoryCache(),
});

const ApolloProvider = ({ children }) => {
  return <AProvider client={client}>{children}</AProvider>;
};

export default ApolloProvider;
