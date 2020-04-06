import * as React from "react";
import { FetchContext } from "../context/FetchProvider";
import to from "../functionalities/to";
import {
  IFetchConfig,
  IFetchResult,
  IUseFetcherResult,
  IFetchFinalConf,
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
    run: async (fetchConf: IFetchConfig) => {
      const resultOrError = await to(
        makeFetch(prepareFetchConfig(fetchConf, fetchContext))
      );
      if (resultOrError instanceof Error) {
        return {
          ...defaultFetchResult(fetchConf?.initData),
          error: resultOrError,
        };
      } else {
        return resultOrError;
      }
    },
  };
};
