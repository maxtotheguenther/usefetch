import * as React from "react";
import { storiesOf } from "@storybook/react";
import "./stories.css"

storiesOf("Introduction", module).add("Getting started", () => <GettingStarted />);

const GettingStarted = () => {
  return <>
    <h1>Getting started</h1>
  </>
}