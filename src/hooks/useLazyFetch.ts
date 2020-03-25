import * as React from "react";
import useFetcher from "./useFetcher";
import { IFetchConfig, IFetchResult, IUseLazyFetchResult } from "../types";

export default (
  fetchConfig: IFetchConfig,
  waitTilDefined: Array<any> = [],
  dependencies: Array<any> = []
): IUseLazyFetchResult => {
  const [result, setResult] = React.useState<IFetchResult>();
  const { run, loading } = useFetcher();
  const dependenciesDefined =
    waitTilDefined.filter(_ => _ === undefined).length === 0;
  React.useEffect(() => {
    async function runQuery() {
      const result = await run(fetchConfig);
      setResult(result);
    }
    dependenciesDefined && runQuery();
  }, [...dependencies, dependenciesDefined]);

  return {
    loading,
    ...result
  };
};
