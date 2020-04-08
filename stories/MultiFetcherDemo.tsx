import * as React from "react";
import { toast } from "react-toastify";
import useFetcher from "../src/hooks/useFetcher";
import { IFetchConfig, IFetchResult } from "../src/types";

const loadUsers = ({ id }: { id: string }): IFetchConfig => ({
  method: "GET",
  path: `api/users/${id}`,
  initData: { hello: "Was geht" },
});

export default () => {
  const fetcher = useFetcher();
  const lol = async () => {
    const wasDasDann = await fetcher.runChain([
      () => loadUsers({ id: "1" }),
      ([last]) => {
        return last.ok ? loadUsers({ id: "asdsadsadad"}) : true
      },
      ([last]) => {
        if (!last.ok) {
          return loadUsers({ id: "3" });
        } else {
          return loadUsers({ id: "10" });
        }
      },
    ]);
    console.log("Was", wasDasDann)
  }
  return (
    <>
      <button onClick={lol}>Load stuff with fetcher</button>
    </>
  );
};
