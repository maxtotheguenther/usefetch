import * as React from "react";
import useFetch from "../src/hooks/useFetch";
import { IFetchConfig } from "../src/types";
import { toast } from "react-toastify";

const loadUserss = (): IFetchConfig => ({
  host: "https://www.mocky.io/",
  fetchSuccess: res => res.ok,
  bodyParser: res => res.json(),
  method: "PUT",
  path: "v2/5185415ba171ea3a00704eed?mocky-delay=2000ms",
  initData: {id: "Lol was geht"},
  onSuccess: result => {
    if (result.ok) {
      toast.info("Local Fetch Success");
    }
  }
});

const loadUsers = (id: string): IFetchConfig => {
  return {
    method: "GET",
    path: `api/users/${id}`,
    fetchSuccess: res => res.ok,
    initData: {id: "Hey"},
    custom: {
      listCtx: { page: 10, limit: 11 }
    }
  };
};

export default () => {
  const { run: fetchUser1, data: user1, rerun } = useFetch(loadUsers);
  const { run: fetchUser2, data: user2, error, abort } = useFetch(loadUserss);
  const fetchStuff = async () => {
    const {
      data: {
        data: { id }
      }
    } = await fetchUser1("1");
    await fetchUser2(id);
  };
  return (
    <>
      <button onClick={fetchStuff}>Load stuff with fetch</button>
      <button onClick={() => abort()}>Abort request 1</button>
      <p>First request</p>
      <p>{JSON.stringify(user1, null, 2)}</p>
      <p>Second request</p>
      <p>{JSON.stringify(user2, null, 2)}</p>
      {error && <p>{error.message}</p>}
      <button onClick={rerun}>Rerun Fetch 1</button>
    </>
  );
};
  