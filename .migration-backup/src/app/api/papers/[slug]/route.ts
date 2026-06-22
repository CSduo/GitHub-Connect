import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const paper = await prisma.paper.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!paper || paper.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({ paper });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
