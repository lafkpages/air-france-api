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

const baseUrl = "https://connect.airfrance.com";

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
    await (await fetch(new URL("ach/api/report"))).json(),
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
    informationalMessagesSchema,
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
