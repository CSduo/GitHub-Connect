import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminAuth } from "@/lib/auth";
import { articleSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAdminAuth();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const where: any = {};
    if (status) where.status = status;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: limit,
        include: { category: true },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({ articles, total });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAdminAuth();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = articleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const slug = body.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // Check slug uniqueness
    const existing = await prisma.article.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const article = await prisma.article.create({
      data: {
        slug: finalSlug,
        title: data.title,
        subtitle: data.subtitle,
        excerpt: data.excerpt,
        body: data.body || "",
        categorySlug: data.categorySlug,
        tags: data.tags,
        authorName: data.authorName,
        heroImageUrl: data.heroImageUrl,
        heroImageAlt: data.heroImageAlt,
        keyTakeaways: data.keyTakeaways,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        audioUrl: data.audioUrl,
        status: data.status,
        featured: data.featured,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      },
    });

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
