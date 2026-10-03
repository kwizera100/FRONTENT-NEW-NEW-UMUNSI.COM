import { NextRequest } from "next/server";
import { proxyTip } from "../../../proxy";

export async function GET(req: NextRequest, { params }: { params: { referenceId: string } }) {
  return proxyTip(req, `/mtn/status/${encodeURIComponent(params.referenceId)}`);
}
