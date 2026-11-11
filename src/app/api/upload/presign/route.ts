import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { R2_BUCKET, MAX_UPLOAD_BYTES, buildObjectKey, getR2Client, isAllowedMediaType, isR2Configured, publicUrlForKey } from "@/lib/r2";
import { verifyUploadToken } from "@/lib/upload-auth";

export const runtime = "edge";

// Returns a short-lived signed URL so the browser can PUT the file straight to
// Cloudflare R2 (bypasses the Vercel request body limit — needed for videos).
export async function POST(req: NextRequest) {
  if (!isR2Configured()) {
    return NextResponse.json({ error: "R2 storage is not configured" }, { status: 503 });
  }

  if (!(await verifyUploadToken(req.headers.get("authorization")))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const filename = String(body.filename || "upload");
  const contentType = String(body.contentType || "application/octet-stream");
  const size = Number(body.size || 0);

  if (!isAllowedMediaType(contentType)) {
    return NextResponse.json({ error: `Unsupported file type: ${contentType}` }, { status: 415 });
  }
  if (size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File is too large" }, { status: 413 });
  }

  const key = buildObjectKey(filename, contentType);
  const uploadUrl = await getSignedUrl(
    getR2Client(),
    new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn: 60 * 15 }
  );

  return NextResponse.json({ uploadUrl, key, url: publicUrlForKey(key) });
}
