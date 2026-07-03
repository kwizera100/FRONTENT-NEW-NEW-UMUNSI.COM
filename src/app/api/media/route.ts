import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const media = await prisma.mediaFile.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(media);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const media = await prisma.mediaFile.create({
      data: {
        filename: body.filename,
        originalName: body.originalName || body.filename,
        mimeType: body.mimeType || "image/jpeg",
        size: body.size || 0,
        url: body.url,
        thumbnailUrl: body.thumbnailUrl,
        category: body.category || "general",
        tags: body.tags || "",
        description: body.description,
        isPublic: body.isPublic ?? true,
        uploadedById: body.uploadedById,
      },
    });
    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("Failed to create media:", error);
    return NextResponse.json({ error: "Failed to create media" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    await prisma.mediaFile.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete media:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
