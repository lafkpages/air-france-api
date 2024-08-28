import { describe, expect, test } from "bun:test";

import {
  getConnectivityStatus,
  getDeviceStatus,
  getFlightData,
  getFlightDataSocket,
  getFlightStatus,
  getFlightTrajectory,
  getHealthReport,
  getInformationalMessages,
  getPortalMetadata,
  isInFlight,
} from "..";
import { isInFlight as isInFlightNode } from "../node";

const isReallyInFlight = confirm("Are you currently in an Air France flight?");

test("isInFlight", () => {
  expect(isInFlight()).resolves.toBe(isReallyInFlight);
  expect(isInFlightNode()).resolves.toBe(isReallyInFlight);
});

describe.if(isReallyInFlight)("in-flight APIs", () => {
  test("getPortalMetadata", () => {
    expect(getPortalMetadata()).resolves.toBeObject();
  });

  test("getFlightStatus", () => {
    expect(getFlightStatus()).resolves.toBeObject();
  });

  test("getConnectivityStatus", () => {
    expect(getConnectivityStatus()).resolves.toBeObject();
  });

  test("getHealthReport", () => {
    expect(getHealthReport()).resolves.toBeArray();
  });

  test("getFlightTrajectory", () => {
    expect(getFlightTrajectory()).resolves.toBeObject();
  });

  test("getInformationalMessages", () => {
    expect(getInformationalMessages()).resolves.toBeObject();
  });

  test("getDeviceStatus", () => {
    expect(getDeviceStatus()).resolves.toBeObject();
  });

  test("getFlightData", () => {
    expect(getFlightData()).resolves.toBeObject();
  });

  test("socket", async () => {
    const socket = getFlightDataSocket();

    socket.on("flight-data", (...args) => {
      console.log("Got flight data", args);
    });

    socket.on("health-status-report", (...args) => {
      console.log("Got health status report", args);
    });

    await Bun.sleep(10000);
  }, 11000);
});
