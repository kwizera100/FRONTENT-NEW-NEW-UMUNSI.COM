import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.umunsi.com/api";

async function safeJson(res: Response): Promise<any> {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json();
  }
  const text = await res.text().catch(() => "");
  try { return JSON.parse(text); } catch { return { message: text.slice(0, 200) }; }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization") || "";

    const userId = body.userId;
    if (!userId) {
      return NextResponse.json({ error: "No user ID provided" }, { status: 400 });
    }

    // Remove userId from the payload - it goes in the URL
    const { userId: _omit, ...updateData } = body;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "application/json",
    };
    if (authHeader) headers["Authorization"] = authHeader;

    // The backend requires username, email, firstName, lastName.
    // First fetch the current user to get those required fields.
    let fullData: Record<string, any> = { ...updateData };
    try {
      const userRes = await fetch(`${API_BASE}/users/${userId}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      });
      if (userRes.ok) {
        const userData = await safeJson(userRes);
        const existing = userData.user || userData.data || userData;
        if (existing && existing.id) {
          fullData = {
            username: existing.username,
            email: existing.email,
            firstName: existing.firstName,
            lastName: existing.lastName,
            role: existing.role,
            isActive: existing.isActive,
            ...updateData, // override with new values
          };
        }
      }
    } catch (e) {
      console.error("Failed to fetch existing user:", e);
    }

    // PUT to /users/{id} - this is the working endpoint
    let res = await fetch(`${API_BASE}/users/${userId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(fullData),
    });

    // Try PATCH if PUT returns 404
    if (res.status === 404) {
      res = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(fullData),
      });
    }

    const data = await safeJson(res);
    if (!res.ok) {
      const errMsg = data.message || data.error ||
        (Array.isArray(data.details)
          ? (typeof data.details === "string"
              ? data.details
              : data.details.map((e: any) => `${e.field}: ${e.message}`).join("; "))
              : "") ||
        `Failed to update profile (${res.status})`;
      return NextResponse.json({ error: errMsg, details: data }, { status: res.status });
    }

    const responseData = data.user || data.data || data;
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
