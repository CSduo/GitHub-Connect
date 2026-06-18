import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { submissionSchema } from "@/lib/validations";
import { getUserAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const auth = await getUserAuth();
    const data = parsed.data;

    const submission = await prisma.submission.create({
      data: {
        userId: auth?.userId || null,
        submitterName: data.submitterName,
        submitterEmail: data.submitterEmail,
        type: data.type,
        title: data.title,
        abstract: data.abstract,
        notes: data.notes,
        consent: Boolean(data.consent),
      },
    });

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getUserAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = { userId: auth.userId };
    if (status) where.status = status;

    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { files: true },
    });

    return NextResponse.json({ submissions });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
