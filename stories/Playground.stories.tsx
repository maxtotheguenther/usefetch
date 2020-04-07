import * as React from "react";
import { storiesOf } from "@storybook/react";
import App from "./App";
import FetchDemo from "./FetchDemo";
import FetcherDemo from "./FetcherDemo";
import "./stories.css";
import LazyFetchDemo from "./LazyFetchDemo";
import MultiFetcherDemo from "./MultiFetcherDemo";

storiesOf("Playground", module)
  .add("UseFetchDemo", () => (
    <App>
      <FetchDemo />
    </App>
  ))
  .add("UseFetcherDemo without context", () => <FetcherDemo />)
  .add("UseLazyFetchDemo", () => (
    <App>
      <LazyFetchDemo />
    </App>
  ))
  .add("UseFetcherDemo", () => (
    <App>
      <FetcherDemo />
    </App>
  ))
  .add("UseMultiFetcher", () => (
    <App>
      <MultiFetcherDemo />
    </App>
  ));
