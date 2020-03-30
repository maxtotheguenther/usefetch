import {
  IFetchConfig,
  IFetchGlobalConf,
  IFetchResult,
  IFetchFinalConf
} from "../types";

export const prepareFetchConfig = (
  fetchConf: IFetchConfig,
  globalFetchConf: IFetchGlobalConf | null
): IFetchFinalConf => {
  if (globalFetchConf) {
    const { requestMiddleware } = globalFetchConf;
    const calculatedFetchConfig: IFetchFinalConf = {
      ...globalFetchConf,
      ...fetchConf,
      onSuccess: (result: IFetchResult) => {
        fetchConf.onSuccess && fetchConf.onSuccess(result);
        globalFetchConf.onSuccess && globalFetchConf.onSuccess(result);
      },
      onError: () => {
        fetchConf.onError && fetchConf.onError();
        globalFetchConf.onError && globalFetchConf.onError();
      },
      custom: {
        ...globalFetchConf.custom,
        ...fetchConf.custom
      }
    };
    return requestMiddleware
      ? requestMiddleware(calculatedFetchConfig)
      : calculatedFetchConfig;
  } else {
    const { method, host, path, fetchSuccess, bodyParser } = fetchConf;
    const errorMsg = (fieldName: string) =>
      `You do not have a FetchContextProvider. Therefore, you must define all the required fields. Missing field: ${fieldName}`;
    if (!method) throw new Error(errorMsg("method"));
    if (!host) throw new Error(errorMsg("host"));
    if (!path) throw new Error(errorMsg("path"));
    if (!fetchSuccess) throw new Error(errorMsg("fetchSuccess"));
    if (!bodyParser) throw new Error(errorMsg("bodyParser"));
    return {
      method,
      host,
      path,
      fetchSuccess,
      bodyParser,
      ...fetchConf
    };
  }
};
