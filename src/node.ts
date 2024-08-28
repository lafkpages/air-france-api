import { lookup } from "node:dns/promises";

import { parse } from "ipaddr.js";

import { baseUrl } from ".";

export async function isInFlight() {
  const result = parse((await lookup(baseUrl.hostname)).address);

  return result.range() === "private";
}
