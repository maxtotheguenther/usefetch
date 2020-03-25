import {
  IFetchConfig,
  IFetchGlobalConf,
  IFetchResult,
  IFetchFinalConf
} from "../types";

export const prepareFetchConfig = (
  fetchConf: IFetchConfig,
  globalFetchConf: IFetchGlobalConf
): IFetchFinalConf => {
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
};
