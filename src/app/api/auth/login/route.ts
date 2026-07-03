import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json(
        { error: "Email cyangwa ijambo ry'ibanga sibyo" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Konti yawe nifite. Baza admin." },
        { status: 403 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, username: user.username },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isPremium: user.isPremium,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
