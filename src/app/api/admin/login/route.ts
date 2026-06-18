import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, comparePassword, createAdminToken, setAdminCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Check env-based admin first
    const envEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (envEmail && email.toLowerCase() === envEmail) {
      const envHash = process.env.ADMIN_PASSWORD_HASH;
      const envPlain = process.env.ADMIN_PASSWORD;
      
      let valid = false;
      if (envHash) {
        valid = await comparePassword(password, envHash);
      } else if (envPlain) {
        valid = password === envPlain;
      }

      if (valid) {
        let admin = await prisma.admin.findUnique({ where: { email: envEmail } });
        if (!admin) {
          const hashedPw = envHash || await hashPassword(password);
          admin = await prisma.admin.create({
            data: { email: envEmail, password: hashedPw, name: "System Admin" },
          });
        }
        const token = await createAdminToken(admin.id, admin.email, admin.role);
        await setAdminCookie(token);
        return NextResponse.json({
          success: true,
          admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
        });
      }
    }

    // Database lookup
    const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await comparePassword(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createAdminToken(admin.id, admin.email, admin.role);
    await setAdminCookie(token);

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
