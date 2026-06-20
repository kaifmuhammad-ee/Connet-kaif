import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { decrypt } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // 1. Authenticate session
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate input status
    const allowedStatuses = ["New", "Replied", "Closed"];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    let updatedEnquiry = null;

    // 3. Update enquiry status with database client fallback
    if (process.env.DATABASE_URL) {
      console.log("Updating enquiry status via direct PostgreSQL connection pool.");
      const sql = `
        UPDATE enquiries
        SET status = $1
        WHERE id = $2
        RETURNING *;
      `;
      const result = await query(sql, [status, id]);
      if (result.rowCount === 0) {
        return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
      }
      updatedEnquiry = result.rows[0];
    } else {
      console.log("Updating enquiry status via Supabase JS client.");
      const { data, error } = await supabase
        .from("enquiries")
        .update({ status })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Supabase update error details:", error);
        return NextResponse.json(
          { error: `Database update failed: ${error.message || JSON.stringify(error)}` },
          { status: 500 }
        );
      }

      if (!data || data.length === 0) {
        return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
      }
      updatedEnquiry = data[0];
    }

    return NextResponse.json({ success: true, enquiry: updatedEnquiry });
  } catch (error: any) {
    console.error("Unexpected error in PATCH /api/admin/enquiries/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
