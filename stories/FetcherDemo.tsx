import * as React from "react";
import { toast } from "react-toastify";
import useFetcher from "../src/hooks/useFetcher";
import { IFetchConfig, IFetchResult } from "../src/types";

const loadUsers: IFetchConfig = {
  host: "https://www.mocky.io/",
  fetchSuccess: res => res.ok,
  bodyParser: res => res.json(),
  method: "PUT",
  path: "v2/5185415ba171ea3a00704eed?mocky-delay=2000ms",
  onSuccess: result => {
    if (result.ok) {
      toast.info("Local Fetch Success");
    }
  }
};

export default () => {
  const fetcher = useFetcher();
  const [fetchResult, setFetchResult] = React.useState<IFetchResult | null>();
  const fetchData = async () => {
    setFetchResult(await fetcher.run(loadUsers)) 
  };
  return (
    <>
      <button onClick={fetchData}>Load stuff with fetcher</button>
      <button onClick={() => fetcher.abortLast()}>Abort</button>
      {fetchResult && <>{JSON.stringify(fetchResult.data, null, 2)}</>}
    </>
  );
};
