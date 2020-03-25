import * as React from "react";
import useFetch from "../src/hooks/useFetch";
import { IFetchConfig } from "../src/types";

const loadUsers = (id: string): IFetchConfig => {
  return {
    method: "GET",
    path: `api/users/${id}`,
    fetchSuccess: res => res.ok,
    custom: {
      listCtx: { page: 10, limit: 11 }
    }
  };
};

export default () => {
  const { run: fetchUser1, data: user1 } = useFetch(loadUsers);
  const { run: fetchUser2, data: user2, error } = useFetch(loadUsers);
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
      <p>First request</p>
      <p>{JSON.stringify(user1, null, 2)}</p>
      <p>Second request</p>
      <p>{JSON.stringify(user2, null, 2)}</p>
      {error && <p>{error.message}</p>}
    </>
  );
};
  