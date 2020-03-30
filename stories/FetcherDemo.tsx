import * as React from "react";
import { toast } from "react-toastify";
import useFetcher from "../src/hooks/useFetcher";
import { IFetchConfig, IFetchResult } from "../src/types";

const loadUsers: IFetchConfig = {
  host: "https://reqres.in/",
  fetchSuccess: (res) => res.ok,
  bodyParser: (res) => res.json(),
  method: "GET",
  path: "api/users",
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
      {fetchResult && (
        <>
          {JSON.stringify(fetchResult.data, null, 2)}
        </>
      )}
    </>
  );
};
