import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { decrypt } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Authenticate session
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch enquiries from database
    const sql = `
      SELECT id, category, name, email, phone, place, message, status, created_at
      FROM enquiries
      ORDER BY created_at DESC;
    `;
    const result = await query(sql);

    return NextResponse.json({ success: true, enquiries: result.rows });
  } catch (error: any) {
    console.error("Error in GET /api/admin/enquiries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
