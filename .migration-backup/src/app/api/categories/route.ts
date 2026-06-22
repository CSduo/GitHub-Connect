import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            articles: { where: { status: "PUBLISHED" } },
            papers: { where: { status: "PUBLISHED" } },
          },
        },
      },
    });

    // Add total count
    const categoriesWithCount = categories.map((cat: any) => ({
      ...cat,
      totalCount: cat._count.articles + cat._count.papers,
    }));

    return NextResponse.json({ categories: categoriesWithCount });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
