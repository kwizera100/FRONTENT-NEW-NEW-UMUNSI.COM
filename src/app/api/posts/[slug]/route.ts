import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        author: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
      },
    });

    if (!post || post.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment views
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();
    const post = await prisma.post.update({
      where: { slug: params.slug },
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        featuredImage: body.featuredImage,
        status: body.status,
        isFeatured: body.isFeatured,
        isPinned: body.isPinned,
        categoryId: body.categoryId,
        tags: body.tags,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.post.delete({ where: { slug: params.slug } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
