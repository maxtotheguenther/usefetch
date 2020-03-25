import * as React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import FetchProvider from "../src/context/FetchProvider";
import { IFetchGlobalConf, IFetchConfig } from "../src/types";
import useFetcher from "../src/hooks/useFetcher";
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

beforeEach(() => {
  fetchMock.resetMocks();
});

test("init useFetcherHook result should be correct", () => {
  const { result } = renderHook(() => useFetcher(), {
    wrapper
  });
  const {
    current: { loading }
  } = result;
  // Got run func.
  expect(result.current).toHaveProperty("run");
  // Got the correct initial state.
  expect(loading).toBeFalsy();
});

test("should switch to loading in case of request", async() => {
  fetchMock.mockResponseOnce(JSON.stringify({ data: "12345" }));
  const { result } = renderHook(() => useFetcher(), {
    wrapper
  });
  const {
    current: { run }
  } = result;
  await act(async () => {
    const hookResult = await run(loadUsers("1"));
    expect(hookResult.ok).toBeTruthy();
  })
})
