import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ posts: [] });
    }

    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { category: true, author: { select: { username: true, firstName: true, lastName: true } } },
      take: 20,
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
