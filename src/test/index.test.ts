import type { FlightData, HealthReport } from "..";

import { describe, expect, mock, test } from "bun:test";

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
  test("getPortalMetadata", async () => {
    expect(await getPortalMetadata()).toBeObject();
  });

  test("getFlightStatus", async () => {
    expect(await getFlightStatus()).toBeObject();
  });

  test("getConnectivityStatus", async () => {
    expect(await getConnectivityStatus()).toBeObject();
  });

  test("getHealthReport", async () => {
    expect(await getHealthReport()).toBeArray();
  });

  test("getFlightTrajectory", async () => {
    expect(await getFlightTrajectory()).toBeObject();
  });

  test("getInformationalMessages", async () => {
    expect(await getInformationalMessages()).toBeObject();
  });

  test("getDeviceStatus", async () => {
    expect(await getDeviceStatus()).toBeObject();
  });

  test("getFlightData", async () => {
    expect(await getFlightData()).toBeObject();
  });

  test("socket", async () => {
    const socket = getFlightDataSocket();

    const flightDataHandler = mock((data: FlightData) => {
      console.log("Got flight data", data);
    });

    const healthStatusReportHandler = mock((data: HealthReport) => {
      console.log("Got health status report", data);
    });

    socket.on("flight-data", flightDataHandler);
    socket.on("health-status-report", healthStatusReportHandler);

    await Bun.sleep(5000);

    socket.disconnect();

    expect(flightDataHandler).toHaveBeenCalled();
    expect(healthStatusReportHandler).toHaveBeenCalled();
  }, 6000);
});
