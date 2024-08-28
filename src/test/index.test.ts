import { expect, test } from "bun:test";

import { isInFlight } from "..";
import { isInFlight as isInFlightNode } from "../node";

const isReallyInFlight = confirm("Are you currently in an Air France flight?");

test("isInFlight", () => {
  expect(isInFlight()).resolves.toBe(isReallyInFlight);
  expect(isInFlightNode()).resolves.toBe(isReallyInFlight);
});
