import * as React from "react";
import useFetcher, { defaultFetchResult } from "./useFetcher";
import { IFetchConfig, IFetchResult, IUseFetchResult } from "../types";

export default (f: (p: any) => IFetchConfig): IUseFetchResult => {
  const [result, setResult] = React.useState<IFetchResult>();
  const { run, loading, abortLast } = useFetcher();

  const wrappedRun = async (params: any) => {
    const result = await run(f(params)); 
    setResult(result);
    return result;
  };
  return {
    ...result,
    loading,
    abort: abortLast,
    run: wrappedRun,
    rerun: async (fetchConf?: IFetchConfig) => {
      if (result) {
        const rerunResult = await result.rerun(fetchConf)
        setResult(rerunResult)
        return rerunResult
      } else {
        return defaultFetchResult;
      }
    },
  };
};
