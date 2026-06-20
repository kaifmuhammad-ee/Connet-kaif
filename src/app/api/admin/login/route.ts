import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { encrypt } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Hardcoded admin email check
    if (email !== "kaif@gmail.com") {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!passwordHash) {
      console.error("ADMIN_PASSWORD_HASH is not set in environment variables.");
      return NextResponse.json(
        { error: "Authentication configuration error." },
        { status: 500 }
      );
    }

    // Verify password hash
    const isValid = await bcrypt.compare(password, passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Create session JWT
    const sessionToken = await encrypt({ email, role: "admin" });

    // Build response and set HTTP-only cookie
    const response = NextResponse.json({ success: true });
    
    // Cookie details: HTTP-only, secure (in production), SameSite Lax
    response.cookies.set({
      name: "admin_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours in seconds
    });

    return response;
  } catch (error: any) {
    console.error("Error in POST /api/admin/login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
