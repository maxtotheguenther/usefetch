import * as React from "react";
import { FetchContext } from "../context/FetchProvider";
import to from "../functionalities/to";
import {
  IFetchConfig,
  IFetchResult,
  IUseFetcherResult,
  IFetchFinalConf,
  IRunChain,
} from "../types";
import { prepareFetchConfig } from "../functionalities/fetch";

export const defaultFetchResult = (initData?: any): IFetchResult => ({
  response: undefined,
  data: initData,
  status: undefined,
  ok: undefined,
  error: undefined,
  rerun: () => new Promise(() => defaultFetchResult(initData)),
});

export default (): IUseFetcherResult => {
  const fetchContext = React.useContext(FetchContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [
    abortController,
    setAbortController,
  ] = React.useState<AbortController | null>(null);

  const run = async (fetchConf: IFetchConfig) => {
    try {
      return await makeFetch(prepareFetchConfig(fetchConf, fetchContext));
    } catch (error) {
      return {
        ...defaultFetchResult(fetchConf.initData),
        error,
      };
    }
  };

  const runChain = async (chainConfigs: IRunChain) => {

    let finalFetches: Promise<Array<
      IFetchResult | undefined
    >> = Promise.resolve([]);

    return chainConfigs
      .reduce<Promise<Array<IFetchResult | undefined>>>(
        async (prevResults, callbackForNextConfig) => {
          const fetchResults = await prevResults;
          const fetchConfig = callbackForNextConfig(fetchResults);
          const breakChain =
            typeof fetchConfig === "boolean" && fetchConfig === true;
          if (breakChain)
            throw new Error(
              "A condition in the chain was not fulfilled. All further calls were cancelled"
            );
          finalFetches = prevResults;
          if (fetchConfig) {
            const execParallel = Array.isArray(fetchConfig);
            if (execParallel) {
              fetchResults.unshift(defaultFetchResult());
            } else {
              const newResult = await run(fetchConfig as IFetchConfig);
              fetchResults.unshift(newResult);
            }
          }
          return fetchResults;
        },
        Promise.resolve([])
      )
      .catch((e) => {
        console.error(e)
        return finalFetches;
      });
  };

  const makeFetch = async (
    finalFetchConfig: IFetchFinalConf
  ): Promise<IFetchResult> => {
    const {
      method,
      host,
      path,
      fetchOptions,
      onSuccess,
      onError,
      fetchSuccess,
      bodyParser,
      responseMiddleware,
    } = finalFetchConfig;
    const newAbortController =
      "AbortController" in window ? new AbortController() : null;
    setAbortController(newAbortController);

    const options: RequestInit | undefined = fetchOptions && {
      ...fetchOptions,
      ...(newAbortController && { signal: newAbortController.signal }),
      method,
    };

    setLoading(true);
    const response = await fetch(`${host}${path}`, options);
    setLoading(false);
    if (response) {
      const data = await to(bodyParser(response));
      const result: IFetchResult = {
        response,
        data,
        status: response.status,
        ok: response.ok,
        rerun: (fetchConf?: IFetchConfig) =>
          fetchConf
            ? makeFetch(prepareFetchConfig(fetchConf, fetchContext))
            : makeFetch(finalFetchConfig), // Rerun with the same config
      };
      const finalResult = responseMiddleware
        ? responseMiddleware(result, finalFetchConfig)
        : result;

      if (fetchSuccess(response)) {
        onSuccess && onSuccess(finalResult);
      } else {
        onError && onError();
      }
      return finalResult;
    }
    throw new Error("An error occurred while fetching.");
  };

  return {
    loading,
    abortLast: () => abortController?.abort(),
    run,
    runChain,
  };
};
