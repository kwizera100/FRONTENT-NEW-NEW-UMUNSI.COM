import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: { where: { status: "PUBLISHED" } }, news: { where: { status: "PUBLISHED" } } },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const category = await prisma.category.create({
      data: {
        slug: body.slug,
        name: body.name,
        description: body.description,
        color: body.color,
        icon: body.icon,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
