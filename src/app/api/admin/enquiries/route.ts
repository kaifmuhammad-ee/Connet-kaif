import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { supabase } from "@/lib/supabase";
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

    let enquiries = [];

    // 2. Fetch enquiries with database client fallback
    if (process.env.DATABASE_URL) {
      console.log("Fetching enquiries via direct PostgreSQL connection pool.");
      const sql = `
        SELECT id, category, name, email, phone, place, message, status, created_at
        FROM enquiries
        ORDER BY created_at DESC;
      `;
      const result = await query(sql);
      enquiries = result.rows;
    } else {
      console.log("Fetching enquiries via Supabase JS client.");
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase select error details:", error);
        return NextResponse.json(
          { error: `Database fetch failed: ${error.message || JSON.stringify(error)}` },
          { status: 500 }
        );
      }
      enquiries = data || [];
    }

    console.log(`Successfully fetched ${enquiries.length} enquiries.`);
    return NextResponse.json({ success: true, enquiries });
  } catch (error: any) {
    console.error("Unexpected error in GET /api/admin/enquiries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
