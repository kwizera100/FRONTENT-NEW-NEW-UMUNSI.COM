import { NextRequest } from "next/server";
import { proxyTip } from "../../proxy";

export async function POST(req: NextRequest) {
  return proxyTip(req, "/author/withdraw");
}
