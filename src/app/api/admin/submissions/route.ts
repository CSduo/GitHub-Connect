import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAdminAuth();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const where: any = {};
    if (status) where.status = status;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { files: true, statusHistory: true },
      }),
      prisma.submission.count({ where }),
    ]);

    return NextResponse.json({ submissions, total });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
