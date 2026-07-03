import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const breaking = searchParams.get("breaking");
    const trending = searchParams.get("trending");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { status: "PUBLISHED" };
    if (category) where.category = { slug: category };
    if (featured === "true") where.isFeatured = true;
    if (breaking === "true") where.isBreaking = true;
    if (trending === "true") where.isTrending = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        category: true,
        author: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.post.count({ where });

    return NextResponse.json({ posts, total, page, limit });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const post = await prisma.post.create({
      data: {
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        featuredImage: body.featuredImage,
        status: body.status || "DRAFT",
        isFeatured: body.isFeatured || false,
        isPinned: body.isPinned || false,
        isPremium: body.isPremium || false,
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
        categoryId: body.categoryId,
        authorId: body.authorId,
        tags: body.tags || "",
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
