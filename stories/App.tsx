import * as React from "react";
import { toast } from "react-toastify";
import { IFetchGlobalConf } from "../src/types";
import FetchProvider from "../src/context/FetchProvider";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
  autoClose: 1000,
  draggable: false
});

function makeToken(length: number): string {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default function App({ children }: {children: React.ReactNode}) {
  const [token, setToken] = React.useState<string>(makeToken(30));
  React.useEffect(() => {
    const interval = setInterval(() => {
      setToken(makeToken(30));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

return <Demo token={token}>{children}</Demo>;
}

const Demo = ({ token, children }: { token: string, children: React.ReactNode }) => {
  const globalOpts: IFetchGlobalConf = {
    host: "https://reqres.in/",
    onSuccess: () => toast.success("Success"),
    onError: () => toast.error("Error"),
    requestMiddleware: fetchConfig => {
      const { fetchOptions } = fetchConfig;
      const updatedFetchOptions: RequestInit = fetchOptions
        ? {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              Authorization: `Baerer ${token}`
            }
          }
        : { headers: { Authorization: `Baerer ${token}` } };
      return { ...fetchConfig, fetchOptions: updatedFetchOptions };
    },
    responseMiddleware: (result, config) => {
      return result;
    },
    fetchSuccess: response => response.ok,
    bodyParser: async response => await response.json(),
    custom: {
      hello: "max"
    }
  };
  return (
    <div className="demo">
      <FetchProvider globalFetchConf={globalOpts}>
        {children}
      </FetchProvider>
    </div>
  );
};
