import { S3Client } from "@aws-sdk/client-s3";

// Cloudflare R2 (S3-compatible) configuration. All values come from env vars:
//   R2_ACCOUNT_ID        - Cloudflare account id (from the dashboard URL)
//   R2_ACCESS_KEY_ID     - R2 API token "Access Key ID"
//   R2_SECRET_ACCESS_KEY - R2 API token "Secret Access Key"
//   R2_BUCKET            - bucket name (e.g. umunsi-media)
//   R2_PUBLIC_URL        - public base URL (r2.dev subdomain or custom domain)
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";

export const R2_BUCKET = process.env.R2_BUCKET || "umunsi250";
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
export const R2_ENDPOINT = process.env.R2_ENDPOINT || (ACCOUNT_ID ? `https://${ACCOUNT_ID}.r2.cloudflarestorage.com` : "");

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB (videos)

export function isR2Configured() {
  return Boolean(R2_ENDPOINT && ACCESS_KEY_ID && SECRET_ACCESS_KEY && R2_BUCKET && R2_PUBLIC_URL);
}

let client: S3Client | null = null;
export function getR2Client() {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
    });
  }
  return client;
}

export function isAllowedMediaType(contentType: string) {
  return /^(image|video|audio)\//i.test(contentType);
}

export function buildObjectKey(filename: string, contentType: string) {
  const kind = contentType.startsWith("video/") ? "videos" : contentType.startsWith("audio/") ? "audio" : "images";
  const ext = (filename.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  const base = filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "media";
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 10);
  return `${kind}/${yyyy}/${mm}/${Date.now()}-${rand}-${base}${ext ? `.${ext}` : ""}`;
}

export function publicUrlForKey(key: string) {
  return `${R2_PUBLIC_URL}/${key.split("/").map(encodeURIComponent).join("/")}`;
}
