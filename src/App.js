import React, { useLayoutEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import history from "./navigation/history";
import Navigation from "./navigation/routes";
import { store, persistedStore } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

import "./App.scss";
import "./styles/styles.scss";

import { interceptor } from "./services";
import ApolloProvider from "./providers/apollo";

const App = () => {
  useLayoutEffect(() => {
    try {
      interceptor(store);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <Provider store={store}>
      <ApolloProvider>
        <PersistGate loading={null} persistor={persistedStore}>
          <BrowserRouter history={history}>
            <Navigation />
          </BrowserRouter>
        </PersistGate>
      </ApolloProvider>
    </Provider>
  );
};

export default App;
