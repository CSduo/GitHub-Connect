import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminAuth } from "@/lib/auth";
import { submissionStatusSchema } from "@/lib/validations";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAdminAuth();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { files: true, statusHistory: { orderBy: { createdAt: "desc" } } },
    });

    if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ submission });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAdminAuth();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const parsed = submissionStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { status, notes } = parsed.data;

    const [submission, history] = await prisma.$transaction([
      prisma.submission.update({
        where: { id },
        data: { status, editorNotes: notes },
      }),
      prisma.submissionStatusHistory.create({
        data: {
          submissionId: id,
          status,
          notes,
          changedBy: auth.adminId,
        },
      }),
    ]);

    return NextResponse.json({ success: true, submission, history });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
