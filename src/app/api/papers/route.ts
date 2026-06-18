import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");
    const peerReviewed = searchParams.get("peerReviewed");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = { status: "PUBLISHED" };
    if (category) where.categorySlug = category;
    if (peerReviewed === "true") where.peerReviewed = true;
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { abstract: { contains: query, mode: "insensitive" } },
      ];
    }

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: limit,
        skip: offset,
        include: { category: true },
      }),
      prisma.paper.count({ where }),
    ]);

    return NextResponse.json({ papers, total, limit, offset });
  } catch {
    return NextResponse.json({ error: "Failed to fetch papers" }, { status: 500 });
  }
}
