import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q || q.length < 2) {
      return NextResponse.json({
        query: q,
        articles: [],
        papers: [],
        categories: [],
        suggestions: [
          "Ethics",
          "Consciousness",
          "Statecraft",
          "Civilisation",
          "Memory",
          "Science",
          "Geopolitics",
          "Philosophy",
        ],
      });
    }

    const [articles, papers, categories] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { subtitle: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
            { body: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 10,
        orderBy: { publishedAt: "desc" },
        include: { category: true },
      }),
      prisma.paper.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { abstract: { contains: q, mode: "insensitive" } },
            { citationText: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 10,
        orderBy: { publishedAt: "desc" },
        include: { category: true },
      }),
      prisma.category.findMany({
        where: {
          visible: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 8,
      }),
    ]);

    return NextResponse.json({
      query: q,
      articles,
      papers,
      categories,
      totalCount: articles.length + papers.length + categories.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
