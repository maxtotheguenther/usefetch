import * as React from "react";
import { storiesOf } from "@storybook/react";
import App from "./App";
import FetchDemo from "./FetchDemo";
import LazyFetchDemo from "./LazyFetchDemo";
import FetcherDemo from "./FetcherDemo";

storiesOf("Playground", module)
  .add("UseFetchDemo", () => (
    <App>
      <FetchDemo />
    </App>
  ))
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
  .add("UseFetcherDemo without context", () => (
      <FetcherDemo />
  ));
  