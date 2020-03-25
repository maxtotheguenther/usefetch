import { cleanup } from "@testing-library/react";
import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();
afterEach(cleanup);
