import { NextRequest } from "next/server";
import { proxyTip } from "../../../proxy";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyTip(req, `/admin/withdrawals/${encodeURIComponent(params.id)}`);
}
