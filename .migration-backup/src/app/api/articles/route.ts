import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const query = searchParams.get("q");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = { status: "PUBLISHED" };
    if (category) where.categorySlug = category;
    if (featured === "true") where.featured = true;
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { subtitle: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
        { body: { contains: query, mode: "insensitive" } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        take: limit,
        skip: offset,
        include: { category: true },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({ articles, total, limit, offset });
  } catch (error) {
    console.error("Articles fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
