const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

// Verifies an admin/author Bearer token against the backend so only logged-in
// users can obtain R2 upload credentials.
export async function verifyUploadToken(authHeader: string | null): Promise<boolean> {
  if (!authHeader || !/^Bearer\s+\S+/i.test(authHeader)) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
