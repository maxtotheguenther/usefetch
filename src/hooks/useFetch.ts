import * as React from "react";
import useFetcher from "./useFetcher";
import { IFetchConfig, IFetchResult, IUseFetchResult } from "../types";

export default (f: (p: any) => IFetchConfig): IUseFetchResult => {
  const [result, setResult] = React.useState<IFetchResult>();
  const { run, loading } = useFetcher();

  const wrappedRun = async (params: any) => {
    const result = await run(f(params)); 
    setResult(result);
    return result;
  };
  return {
    loading,
    run: wrappedRun,
    ...result
  };
};
