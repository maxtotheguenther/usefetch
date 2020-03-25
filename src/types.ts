export interface IFetchResult {
  data?: any;
  response?: Response;
  error?: Error,
  status?: number;
  ok?: boolean;
  custom?: any;
}

export interface IUseFetchResult extends IFetchResult {
  loading: boolean;
  run: (params: any) => Promise<IFetchResult>;
}

export interface IUseLazyFetchResult extends IFetchResult {
  loading: boolean;
}

export interface IUseFetcherResult {
  loading: boolean;
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

export interface IFetchContext extends IFetchGlobalConf, IFetchState { }
