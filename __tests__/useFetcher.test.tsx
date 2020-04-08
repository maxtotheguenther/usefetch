import * as React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import FetchProvider from "../src/context/FetchProvider";
import { IFetchGlobalConf } from "../src/types";
import useFetcher from "../src/hooks/useFetcher";
import fetchMock from "jest-fetch-mock";

const globalOpts: IFetchGlobalConf = {
  host: "https://reqres.in/",
  fetchSuccess: (response) => response.ok,
  bodyParser: async (response) => await response.json(),
};

const notFound = {
  host: "https://notfound.com",
  method: "GET",
  path: "",
};

const ok = {
  host: "https://ok.com",
  method: "GET",
  path: "",
};

const wrapper = ({ children }: any) => (
  <FetchProvider globalFetchConf={globalOpts}>{children}</FetchProvider>
);

beforeEach(() => {
  fetchMock.mockIf(/^https?:\/\/notfound.com.*$/, () => {
    return Promise.resolve({
      status: 404,
      body: JSON.stringify({ error: "NotFound" }),
    });
  });
  fetchMock.mockIf(/^https?:\/\/ok.com.*$/, () => {
    return Promise.resolve({
      status: 200,
      body: JSON.stringify({ id: "1" }),
    });
  });
});

test("init useFetcherHook result should be correct", () => {
  const { result } = renderHook(() => useFetcher(), {
    wrapper,
  });
  const {
    current: { loading },
  } = result;
  // Got run func.
  expect(result.current).toHaveProperty("run");
  expect(result.current).toHaveProperty("runChain");
  expect(result.current).toHaveProperty("abortLast");
  // Got the correct initial state.
  expect(loading).toBeFalsy();
});

test("should build the correct fetch", () => {
  
})

test("should switch to loading in case of request", async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ data: "12345" }));
  const { result } = renderHook(() => useFetcher(), {
    wrapper,
  });
  const {
    current: { run },
  } = result;
  await act(async () => {
    const hookResult = await run(ok);
    expect(hookResult.ok).toBeTruthy();
  });
});

test("abort last request", async () => {
  const { result } = renderHook(() => useFetcher(), {
    wrapper,
  });
  await act(async () => {
    const hookResult = await result.current.runChain([
      () => notFound,
      () => ok,
    ]);
    expect(hookResult.length).toBe(2);
    const [okRequest, notFoundRequest] = hookResult;
    expect(okRequest.ok).toBeTruthy();
    expect(notFoundRequest.ok).toBeFalsy();
  });
});
