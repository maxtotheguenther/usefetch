import * as React from "react";
import { toast } from "react-toastify";
import to from "../src/functionalities/to";
import useFetcher from "../src/hooks/useFetcher";
import { IFetchConfig, IFetchResult } from "../src/types";

const loadUsers: IFetchConfig = {
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
