import * as React from "react";
import { IFetchGlobalConf, IFetchContext, IFetchState } from "../types";

export const FetchContext = React.createContext<IFetchContext | null>(null);

export default ({
  globalFetchConf,
  children
}: {
  globalFetchConf: IFetchGlobalConf;
  children: React.ReactNode;
}) => {
  const setIsLoading = (isLoading: boolean) => {
    setState({ ...state, loading: isLoading });
  };
  const setError = (hasError: boolean) => {
    setState({ ...state, error: hasError });
  };
  const [state, setState] = React.useState<IFetchState>({
    loading: false,
    setLoading: setIsLoading,
    error: false,
    setError: setError
  });

  const value: IFetchContext = {
    ...globalFetchConf,
    ...state
  };
  // Pretty nooby :D
  //const styles = value.loading ? { display: "none" } : {};
  return (
    <FetchContext.Provider value={value}>{children}</FetchContext.Provider>
  );
};
