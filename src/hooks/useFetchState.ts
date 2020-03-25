import * as React from "react";
import { FetchContext } from "../context/FetchProvider";
import { IFetchStateResult } from "../types";

export default (): IFetchStateResult => {
  const { loading, error } = React.useContext(FetchContext);
  return {
    loading,
    error
  };
};
