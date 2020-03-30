import * as React from "react";
import useLazyFetchNew from "../src/hooks/useLazyFetch";
import { IFetchConfig } from "../src/types";

const loadUsers = ({ id }: { id: string }): IFetchConfig => ({
  method: "GET",
  path: `api/users/${id}`
});

export default () => {  
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const { data, loading, rerun } = useLazyFetchNew(loadUsers({ id: "1" }));
  const id = data?.data && "2";
  const emailIsCorrect = data?.data?.email === "george.bluth@reqres.in";
  
  const { data: data2, loading: loading2 } = useLazyFetchNew([
    loadUsers({ id }),
    [id, emailIsCorrect]
  ]);

  return (
    <React.Fragment>
      <h4>Lazy Loaded Stuff on mount</h4>
      <p>First request</p>
      <button onClick={() => rerun()}>Rerun first request</button>
      <p>
        First request loading:
        {loading ? (
          <b style={{ color: "green" }}>Yes</b>
        ) : (
          <b style={{ color: "lightblue" }}>No</b>
        )}
      </p>
      {JSON.stringify(data, undefined, 4)}
      <p>Second request</p>
      <p>
        Second request loading:
        {loading2 ? (
          <b style={{ color: "green" }}>Yes</b>
        ) : (
          <b style={{ color: "lightblue" }}>No</b>
        )}
      </p>
      {JSON.stringify(data2, null, 2)}
    </React.Fragment>
  );
};
