import { io } from "socket.io-client";
import { parse, union } from "valibot";

import {
  connectivityStatusSchema,
  deviceStatusSchema,
  errorSchema,
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

export async function getPortalMetadata() {
  return parse(
    portalMetadataSchema,
    await (await fetch(new URL("config.json", baseUrl))).json(),
  );
}

export async function getFlightStatus() {
  return parse(
    flightStatusSchema,
    await (
      await fetch(new URL("ach/api/payload/flightstatusdetails", baseUrl))
    ).json(),
  );
}

export async function getConnectivityStatus() {
  return parse(
    connectivityStatusSchema,
    await (await fetch(new URL("ach/api/status", baseUrl))).json(),
  );
}

export async function getHealthReport() {
  return parse(
    healthReportSchema,
    await (await fetch(new URL("ach/api/status/report", baseUrl))).json(),
  );
}

export async function getFlightTrajectory() {
  return parse(
    flightTrajectorySchema,
    await (
      await fetch(new URL("ach/api/payload/flighttrajectory", baseUrl))
    ).json(),
  );
}

export async function getInformationalMessages() {
  return parse(
    union([informationalMessagesSchema, errorSchema]),
    await (
      await fetch(new URL("ach/api/payload/informational-messages", baseUrl))
    ).json(),
  );
}

export async function getDeviceStatus() {
  return parse(
    deviceStatusSchema,
    await (await fetch(new URL("ach/api/connectivity/device", baseUrl))).json(),
  );
}

export async function getFlightData() {
  return parse(
    flightDataSchema,
    await (await fetch(new URL("ach/api/flightdata", baseUrl))).json(),
  );
}

export function getFlightDataSocket(
  options?: typeof io extends (first: any, options: infer U) => any ? U : never,
) {
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
