export type IFetchConfigDependsOn = [IFetchConfig, Array<any>]
export type IFetchConfigOrFetchConfigDependsOn = IFetchConfig | IFetchConfigDependsOn

export interface IFetchResult {
  data?: any;
  response?: Response;
  error?: Error,
  status?: number;
  ok?: boolean;
  custom?: any;
  rerun: (fetchConf?: IFetchConfig) => Promise<IFetchResult>;
}

export interface IUseFetchResult extends IFetchResult {
  loading: boolean;
  abort: () => void;
  run: (params: any) => Promise<IFetchResult>;
}

export interface IUseLazyFetchResult extends IFetchResult {
  loading: boolean;
  abort: () => void;
}

export interface IUseFetcherResult {
  loading: boolean;
  abortLast: () => void;
  run: (fetchConfig: IFetchConfig) => Promise<IFetchResult>;
}

export interface BaseConfig {
  onSuccess?: (result: IFetchResult) => void;
  onError?: () => void;
  fetchOptions?: RequestInit;
  custom?: any;
}

export interface IFetchConfig extends BaseConfig {
  path: string;
  method: string;
  host?: string;
  initData?: any;
  fetchSuccess?: (response: Response) => boolean;
  bodyParser?: (response: Response) => Promise<any>;
}

export interface IFetchGlobalConf extends BaseConfig {
  host: string;
  requestMiddleware?: (fetchFinalConfig: IFetchFinalConf) => IFetchFinalConf;
  responseMiddleware?: (
    fetchResult: IFetchResult,
    fetchFinalConfig: IFetchFinalConf
  ) => IFetchResult;
  fetchSuccess: (response: Response) => boolean;
  bodyParser: (response: Response) => Promise<any>;
}

export interface IFetchFinalConf {
  host: string;
  path: string;
  method: string;
  fetchSuccess: (response: Response) => boolean;
  bodyParser: (response: Response) => Promise<any>;
  requestMiddleware?: (fetchFinalConfig: IFetchFinalConf) => IFetchFinalConf;
  responseMiddleware?: (
    fetchResult: IFetchResult,
    fetchFinalConfig: IFetchFinalConf
  ) => IFetchResult;
  onSuccess?: (result: IFetchResult) => void;
  onError?: () => void;
  fetchOptions?: RequestInit;
  custom?: any;
}

/**
 * FETCH STATE TYPES
 */
export interface IFetchStateResult {
  loading: boolean;
  error: boolean;
}

export interface IFetchState {
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  error: boolean;
  setError: (hasError: boolean) => void;
}

/**
 * FETCH CONTEXT TYPES
 */
export interface IFetchContext extends IFetchGlobalConf, IFetchState { }
