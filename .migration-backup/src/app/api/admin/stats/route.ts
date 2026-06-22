import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminAuth } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAdminAuth();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalPapers,
      publishedPapers,
      newSubmissions,
      totalSubmissions,
      newsletterCount,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.paper.count(),
      prisma.paper.count({ where: { status: "PUBLISHED" } }),
      prisma.submission.count({ where: { status: "RECEIVED" } }),
      prisma.submission.count(),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      articles: { total: totalArticles, published: publishedArticles, drafts: draftArticles },
      papers: { total: totalPapers, published: publishedPapers },
      submissions: { total: totalSubmissions, new: newSubmissions },
      newsletter: { subscribers: newsletterCount },
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
