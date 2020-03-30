import * as React from "react";
import useFetcher from "./useFetcher";
import { IFetchConfig, IFetchResult, IUseLazyFetchResult, IFetchConfigOrFetchConfigDependsOn } from "../types";

export default (
  fetchConfig: IFetchConfigOrFetchConfigDependsOn,
  dependencies: Array<any> = []
): IUseLazyFetchResult => {
  const fetchDependsOn = fetchConfig[0]
  const areAllDependenciesDefined = () => {
    if (fetchDependsOn) {
      const waitFor = fetchConfig[1] as Array<any>
      return waitFor.filter(_ => _ === undefined || _ === null || _ === false).length === 0;
    }
    return true
  }
  const dependenciesDefined = areAllDependenciesDefined()
  const config = fetchDependsOn ? fetchConfig[0] as IFetchConfig : fetchConfig as IFetchConfig
  const [result, setResult] = React.useState<IFetchResult>();
  const { run, loading, abortLast } = useFetcher();
  React.useEffect(() => {
    async function runQuery() {
      const result = await run(config);
      setResult(result);
    }
    dependenciesDefined && runQuery();
  }, [...dependencies, dependenciesDefined]);

  return {
    abort: abortLast,
    loading,
    ...result
  };
};