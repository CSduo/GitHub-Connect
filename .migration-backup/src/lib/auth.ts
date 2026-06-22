import bcryptjs from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const AUTH_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-change-in-production"
);

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "admin-secret-change-in-production"
);

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

// User JWT tokens
export async function createUserToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ userId, email, type: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(AUTH_SECRET);
}

export async function verifyUserToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, AUTH_SECRET, {
      clockTolerance: 60,
    });
    return payload as { userId: string; email: string; type: string };
  } catch {
    return null;
  }
}

// Admin JWT tokens
export async function createAdminToken(adminId: string, email: string, role: string): Promise<string> {
  return new SignJWT({ adminId, email, role, type: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(ADMIN_SECRET);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_SECRET, {
      clockTolerance: 60,
    });
    return payload as { adminId: string; email: string; role: string; type: string };
  } catch {
    return null;
  }
}

// Cookie helpers
export async function getUserAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_session")?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function getAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function setUserCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("user_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60, // 8 hours
  });
}

export async function clearUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
