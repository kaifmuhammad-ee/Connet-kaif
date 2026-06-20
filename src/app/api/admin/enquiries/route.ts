import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

    // 2. Fetch enquiries from database via Supabase client
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

    return NextResponse.json({ success: true, enquiries: data || [] });
  } catch (error: any) {
    console.error("Unexpected error in GET /api/admin/enquiries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
