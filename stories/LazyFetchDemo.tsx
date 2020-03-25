import * as React from "react";
import useLazyFetch from "../src/hooks/useLazyFetch";

const loadUsers = ({ id }: { id: string }) => ({
  method: "GET",
  path: `api/users/${id}`
});

export default () => {
  const blub = { id: "1" };
  const { data } = useLazyFetch(loadUsers({ id: blub.id }), [blub]);
  const newId = data && data.data && data.data.id;
  const { data: data2 } = useLazyFetch(loadUsers({ id: newId }), [newId]);
  return (
    <React.Fragment>
      <h4>Lazy Loaded Stuff on mount</h4>
      <p>First request</p>
      {JSON.stringify(data, null, 2)}
      <p>Second request</p>
      {JSON.stringify(data2, null, 2)}
    </React.Fragment>
  );
};
