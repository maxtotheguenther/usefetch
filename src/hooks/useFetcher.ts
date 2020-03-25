import * as React from "react";
import { FetchContext } from "../context/FetchProvider";
import to from "../functionalities/to";
import {
  IFetchConfig,
  IFetchResult,
  IUseFetcherResult,
  IFetchFinalConf
} from "../types";
import { prepareFetchConfig } from "../functionalities/fetch";

export default (): IUseFetcherResult => {
  const fetchContext = React.useContext(FetchContext);
  const [loading, setLoading] = React.useState<boolean>(false);

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
      bodyParser
    } = finalFetchConfig;
    const {
      responseMiddleware,
      setLoading: setGlobalLoading,
      setError: setGlobalError
    } = fetchContext;
    const options: RequestInit | undefined = fetchOptions && {
      ...fetchOptions,
      method
    };
    setLoading(true);
    setGlobalLoading(true);
    const response = await fetch(`${host}${path}`, options);
    setGlobalLoading(false);
    setLoading(false);
    if (response && fetchSuccess(response)) {
      const data = await to(bodyParser(response));
      const result: IFetchResult = {
        response,
        data,
        status: response.status,
        ok: response.ok
      };
      const finalResult = responseMiddleware
        ? responseMiddleware(result, finalFetchConfig)
        : result;
      onSuccess && onSuccess(finalResult);
      return finalResult;
    }
    setGlobalError(true);
    onError && onError();
    throw new Error("An error occurred while fetching.")
  };

  return {
    loading,
    run: async(fetchConf: IFetchConfig) => {
      const resultOrError = await to(makeFetch(prepareFetchConfig(fetchConf, fetchContext)));
      if (resultOrError instanceof Error) {
        return {
          response: undefined,
          data: undefined,
          status: undefined,
          ok: undefined,
          error: resultOrError
        };
      } else {
        return resultOrError
      }
    }
      
  };
};
