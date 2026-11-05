// One-time Cloudflare R2 bucket setup: applies the CORS policy that lets the
// browser upload directly to the bucket from umunsi.com, then does a tiny
// round-trip test upload.
//
// Usage (reads R2_* vars from env or .env.local):
//   node scripts/r2-setup.mjs
import { readFileSync, existsSync } from "node:fs";
import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL } = process.env;
const R2_BUCKET = process.env.R2_BUCKET || "umunsi250";
const endpoint = process.env.R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("Missing R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY");
  process.exit(1);
}

const s3 = new S3Client({ region: "auto", endpoint, credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY } });

const allowedOrigins = (process.env.R2_CORS_ORIGINS || "https://umunsi.com,https://www.umunsi.com,https://frontent-new-new-umunsi-com.vercel.app,http://localhost:3000")
  .split(",").map((s) => s.trim()).filter(Boolean);

await s3.send(new PutBucketCorsCommand({
  Bucket: R2_BUCKET,
  CORSConfiguration: {
    CORSRules: [{
      AllowedOrigins: allowedOrigins,
      AllowedMethods: ["GET", "HEAD", "PUT", "POST"],
      AllowedHeaders: ["*"],
      ExposeHeaders: ["ETag"],
      MaxAgeSeconds: 3600,
    }],
  },
}));
console.log("CORS applied for:", allowedOrigins.join(", "));

const cors = await s3.send(new GetBucketCorsCommand({ Bucket: R2_BUCKET }));
console.log("Current CORS rules:", JSON.stringify(cors.CORSRules, null, 2));

const key = `health/r2-setup-${Date.now()}.txt`;
await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: "ok", ContentType: "text/plain" }));
console.log("Test upload OK:", key);
if (R2_PUBLIC_URL) {
  const res = await fetch(`${R2_PUBLIC_URL.replace(/\/+$/, "")}/${key}`);
  console.log(`Public read via ${R2_PUBLIC_URL}: HTTP ${res.status}${res.ok ? " (public access works)" : " (check Public Sharing / r2.dev subdomain)"}`);
}
await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
console.log("Done.");
