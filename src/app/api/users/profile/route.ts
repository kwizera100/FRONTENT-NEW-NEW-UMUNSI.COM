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

    const { userId: _omit, ...profileData } = body;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "application/json",
    };
    if (authHeader) headers["Authorization"] = authHeader;

    const url = `${API_BASE}/users/${userId}`;

    // First, fetch the current user to get required fields
    let fullData: Record<string, any> = { ...profileData };
    try {
      const usersRes = await fetch(`${API_BASE}/users`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        const users = Array.isArray(usersData) ? usersData : usersData.data || usersData.users || [];
        const existingUser = users.find((u: any) => u.id === userId);
        if (existingUser) {
          // Merge: start with existing user data, override with new profile data
          fullData = { ...existingUser, ...profileData };
          // Remove fields that shouldn't be sent
          delete fullData.password;
          delete fullData.createdAt;
          delete fullData.updatedAt;
          delete fullData.lastLogin;
        }
      }
    } catch (e) {
      console.error("Failed to fetch existing user for merge:", e);
    }

    const bodyStr = JSON.stringify(fullData);

    // Try PUT first, then PATCH
    let res = await fetch(url, { method: "PUT", headers, body: bodyStr });

    if (res.status === 404) {
      res = await fetch(url, { method: "PATCH", headers, body: bodyStr });
    }

    // If still validation error, try with only core fields
    if (!res.ok && (res.status === 400 || res.status === 422)) {
      const coreData: Record<string, any> = {};
      const fields = ["bio", "avatar", "firstName", "lastName", "phone", "profileUrl",
                      "email", "username", "role", "isPremium", "isActive", "isVerified",
                      "socialLinks", "profileColor", "coverImage"];
      for (const f of fields) {
        if (fullData[f] !== undefined) coreData[f] = fullData[f];
      }
      const coreStr = JSON.stringify(coreData);
      res = await fetch(url, { method: "PUT", headers, body: coreStr });
      if (res.status === 404) {
        res = await fetch(url, { method: "PATCH", headers, body: coreStr });
      }
    }

    const data = await safeJson(res);
    if (!res.ok) {
      const errMsg = data.message || data.error ||
        (Array.isArray(data.errors) ? data.errors.map((e: any) => e.message || e.msg || String(e)).join("; ") : "") ||
        `Failed to update profile (${res.status})`;
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }

    // Return merged data so client sees all fields
    const responseData = data.data || data.user || data;
    const merged = { ...responseData, ...profileData };
    return NextResponse.json(merged);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
