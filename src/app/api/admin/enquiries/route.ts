import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabase";
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
    let fetched = false;
    const errorsLog: string[] = [];

    // 2. Fetch enquiries with database client fallback
    if (process.env.DATABASE_URL) {
      try {
        console.log("Fetching enquiries via direct PostgreSQL connection pool.");
        const sql = `
          SELECT id, category, name, email, phone, place, message, status, created_at
          FROM enquiries
          ORDER BY created_at DESC;
        `;
        const result = await query(sql);
        enquiries = result.rows;
        fetched = true;
        console.log(`Successfully fetched ${enquiries.length} enquiries via PostgreSQL pool.`);
      } catch (dbError: any) {
        const msg = `PostgreSQL direct query failed: ${dbError.message || dbError}`;
        console.error(msg, dbError);
        errorsLog.push(msg);
      }
    }

    if (!fetched) {
      try {
        console.log("Fetching enquiries via Supabase Admin JS client.");
        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
          .from("enquiries")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase Admin select error details:", error);
          errorsLog.push(`Supabase select query failed: ${error.message || JSON.stringify(error)}`);
        } else {
          enquiries = data || [];
          fetched = true;
          console.log(`Successfully fetched ${enquiries.length} enquiries via Supabase Admin Client.`);
        }
      } catch (sbError: any) {
        const msg = `Supabase Admin client instantiation/execution failed: ${sbError.message || sbError}`;
        console.error(msg, sbError);
        errorsLog.push(msg);
      }
    }

    if (!fetched) {
      return NextResponse.json(
        {
          error: "Database fetch failed completely.",
          details: errorsLog.join(" | "),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, enquiries });
  } catch (error: any) {
    console.error("Unexpected error in GET /api/admin/enquiries:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || String(error) },
      { status: 500 }
    );
  }
}

