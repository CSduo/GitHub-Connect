import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminAuth } from "@/lib/auth";
import { paperSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAdminAuth();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const where: any = {};
    if (status) where.status = status;

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where, orderBy: { updatedAt: "desc" },
        include: { category: true },
      }),
      prisma.paper.count({ where }),
    ]);
    return NextResponse.json({ papers, total });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAdminAuth();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = paperSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const data = parsed.data;
    const slug = body.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const existing = await prisma.paper.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const paper = await prisma.paper.create({
      data: {
        slug: finalSlug,
        title: data.title,
        abstract: data.abstract,
        body: data.body || "",
        categorySlug: data.categorySlug,
        tags: data.tags,
        authorName: data.authorName,
        pdfUrl: data.pdfUrl,
        coverImageUrl: data.coverImageUrl,
        citationText: data.citationText,
        peerReviewed: data.peerReviewed,
        paperType: data.paperType,
        year: data.year,
        doi: data.doi,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        status: data.status,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      },
    });

    return NextResponse.json({ success: true, paper }, { status: 201 });
  } catch (error) {
    console.error("Create paper error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
