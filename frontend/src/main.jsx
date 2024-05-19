import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GridBackground from "./components/GridBackground.jsx";
import "./index.css";
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  credentials: "include", //This tells apollo client to send cookies along with every request
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GridBackground>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </GridBackground>
    </BrowserRouter>
  </React.StrictMode>
);
