import * as React from "react";
import { FetchContext } from "../context/FetchProvider";
import { IFetchStateResult } from "../types";

export default (): IFetchStateResult => {
  const fetchContext = React.useContext(FetchContext);
  if (!fetchContext)
    throw new Error(
      "Please do not use this hook if you do not specify a FetchProvider"
    );
  const { loading, error } = fetchContext;
  return {
    loading,
    error
  };
};
