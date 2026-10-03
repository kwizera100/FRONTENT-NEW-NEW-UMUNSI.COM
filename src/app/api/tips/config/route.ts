import { NextRequest } from "next/server";
import { proxyTip } from "../proxy";

export async function GET(req: NextRequest) {
  return proxyTip(req, "/config");
}
