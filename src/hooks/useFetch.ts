import * as React from "react";
import useFetcher, { defaultFetchResult } from "./useFetcher";
import { IFetchConfig, IFetchResult, IUseFetchResult } from "../types";

export default (f: (p: any) => IFetchConfig): IUseFetchResult => {
  const [result, setResult] = React.useState<IFetchResult>();
  const [fetchConfig, setFetchConfig] = React.useState<IFetchConfig>();
  const { run, loading, abortLast } = useFetcher();
  const wrappedRun = async (params: any) => {
    const config = f(params)
    setFetchConfig(config)
    const result = await run(config); 
    setResult(result);
    return result;
  };
  return {
    data: fetchConfig?.initData,
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
        return defaultFetchResult(fetchConf?.initData);
      }
    },
  };
};
