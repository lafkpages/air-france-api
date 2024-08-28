import type { InferOutput } from "valibot";

import { io, Socket } from "socket.io-client";
import { parse } from "valibot";

import {
  connectivityStatusSchema,
  deviceStatusSchema,
  flightDataSchema,
  flightStatusSchema,
  flightTrajectorySchema,
  healthReportSchema,
  informationalMessagesSchema,
  portalMetadataSchema,
} from "./schemas";

export const baseUrl = new URL("https://connect.airfrance.com");

/**
 * A simpler yet maybe more inaccurate method to check if currently
 * on-board an Air France flight. For a more accurate method that
 * only works on Node, and not in the browser, see the `isInFlight`
 * function in `src/node.ts`.
 */
export async function isInFlight() {
  const resp = await fetch(new URL("config.json", baseUrl), {
    method: "HEAD",
    redirect: "manual",
  });
  return (
    resp.status === 200 &&
    !!resp.headers.get("content-type")?.startsWith("application/json")
  );
}

export type PortalMetadata = InferOutput<typeof portalMetadataSchema>;
export async function getPortalMetadata(): Promise<PortalMetadata> {
  return parse(
    portalMetadataSchema,
    await (await fetch(new URL("config.json", baseUrl))).json(),
  );
}

export type FlightStatus = InferOutput<typeof flightStatusSchema>;
export async function getFlightStatus(): Promise<FlightStatus> {
  return parse(
    flightStatusSchema,
    await (
      await fetch(new URL("ach/api/payload/flightstatusdetails", baseUrl))
    ).json(),
  );
}

export type ConnectivityStatus = InferOutput<typeof connectivityStatusSchema>;
export async function getConnectivityStatus(): Promise<ConnectivityStatus> {
  return parse(
    connectivityStatusSchema,
    await (await fetch(new URL("ach/api/status", baseUrl))).json(),
  );
}

export type HealthReport = InferOutput<typeof healthReportSchema>;
export async function getHealthReport(): Promise<HealthReport> {
  return parse(
    healthReportSchema,
    await (await fetch(new URL("ach/api/status/report", baseUrl))).json(),
  );
}

export type FlightTrajectory = InferOutput<typeof flightTrajectorySchema>;
export async function getFlightTrajectory(): Promise<FlightTrajectory> {
  return parse(
    flightTrajectorySchema,
    await (
      await fetch(new URL("ach/api/payload/flighttrajectory", baseUrl))
    ).json(),
  );
}

export type InformationalMessages = InferOutput<
  typeof informationalMessagesSchema
>;
export async function getInformationalMessages(): Promise<InformationalMessages> {
  return parse(
    informationalMessagesSchema,
    await (
      await fetch(new URL("ach/api/payload/informational-messages", baseUrl))
    ).json(),
  );
}

export type DeviceStatus = InferOutput<typeof deviceStatusSchema>;
export async function getDeviceStatus(): Promise<DeviceStatus> {
  return parse(
    deviceStatusSchema,
    await (await fetch(new URL("ach/api/connectivity/device", baseUrl))).json(),
  );
}

export type FlightData = InferOutput<typeof flightDataSchema>;
export async function getFlightData(): Promise<FlightData> {
  return parse(
    flightDataSchema,
    await (await fetch(new URL("ach/api/flightdata", baseUrl))).json(),
  );
}

export function getFlightDataSocket(
  options?: typeof io extends (first: any, options: infer U) => any ? U : never,
): Socket<
  {
    "flight-data": (flightData: FlightData) => void;
    "health-status-report": (healthReport: HealthReport) => void;
  },
  {}
> {
  options = {
    // defaults gotten from:
    // https://connect.airfrance.com/ach/js/aircon-hub-library.js
    reconnectionDelay: 10000,
    reconnectionDelayMax: 20000,
    randomizationFactor: 0,

    ...options,
  };

  return io(new URL("connectivity", baseUrl).href, options);
}
