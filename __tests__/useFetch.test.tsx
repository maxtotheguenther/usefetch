import * as React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import useFetch from "../src/hooks/useFetch";
import FetchProvider from "../src/context/FetchProvider";
import { IFetchConfig, IFetchGlobalConf } from "../src/types";
import fetchMock from "jest-fetch-mock";

const globalOpts: IFetchGlobalConf = {
  host: "https://reqres.in/",
  fetchSuccess: response => response.ok,
  bodyParser: async response => await response.json()
};

const loadUsers = (id: string): IFetchConfig => {
  return {
    method: "GET",
    path: `api/users/${id}`
  };
};

const wrapper = ({ children }: any) => (
  <FetchProvider globalFetchConf={globalOpts}>{children}</FetchProvider>
);

test("init useFetchHook result should be correct", () => {
  const { result } = renderHook(() => useFetch(loadUsers), {
    wrapper
  });
  const { current: { run, abort, ...other } } = result
  // Got run func.
  expect(result.current).toHaveProperty("run");
  expect(result.current).toHaveProperty("abort");
  // Got the correct initial state.
  expect(other).toEqual({
    loading: false,
    data: undefined,
    response: undefined,
    error: undefined,
    status: undefined,
    ok: undefined,
    custom: undefined
  });
});

test("should switch to loading in case of request", async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ data: "12345" }));
  const { result } = renderHook(() => useFetch(loadUsers), {
    wrapper
  });
  const {
    current: { run }
  } = result;
  await act(async () => {
    await run(loadUsers("1"));
    expect(result.current.ok).toBeTruthy();
  });
});