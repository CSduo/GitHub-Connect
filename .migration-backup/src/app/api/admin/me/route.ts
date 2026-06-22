import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const auth = await getAdminAuth();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: auth.adminId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ admin });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
