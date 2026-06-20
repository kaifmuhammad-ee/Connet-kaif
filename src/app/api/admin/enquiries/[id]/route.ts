import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabase";
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
    let updated = false;
    const errorsLog: string[] = [];

    // 3. Update enquiry status with database client fallback
    if (process.env.DATABASE_URL) {
      try {
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
        updated = true;
        console.log(`Successfully updated status via PostgreSQL connection.`);
      } catch (dbError: any) {
        const msg = `PostgreSQL update query failed: ${dbError.message || dbError}`;
        console.error(msg, dbError);
        errorsLog.push(msg);
      }
    }

    if (!updated) {
      try {
        console.log("Updating enquiry status via Supabase Admin JS client.");
        const supabaseAdmin = getSupabaseAdmin();
        console.log(`DEBUG: Executing Supabase Admin UPDATE query for ID: ${id}...`);
        const { data, error } = await supabaseAdmin
          .from("enquiries")
          .update({ status })
          .eq("id", id)
          .select();

        console.log("DEBUG: Supabase Admin UPDATE query finished. Raw Response:", {
          hasData: !!data,
          dataLength: data ? data.length : null,
          updatedRow: data ? data[0] : null,
          error: error ? { message: error.message, details: error.details, hint: error.hint, code: error.code } : null
        });

        if (error) {
          console.error("Supabase Admin update error details:", error);
          errorsLog.push(`Supabase update query failed: ${error.message || JSON.stringify(error)}`);
        } else if (!data || data.length === 0) {
          return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
        } else {
          updatedEnquiry = data[0];
          updated = true;
          console.log(`Successfully updated status via Supabase Admin Client.`);
        }
      } catch (sbError: any) {
        const msg = `Supabase Admin update client instantiation/execution failed: ${sbError.message || sbError}`;
        console.error(msg, sbError);
        errorsLog.push(msg);
      }
    }

    if (!updated) {
      return NextResponse.json(
        {
          error: "Database update failed completely.",
          details: errorsLog.join(" | "),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, enquiry: updatedEnquiry });
  } catch (error: any) {
    console.error("Unexpected error in PATCH /api/admin/enquiries/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. Authenticate session
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let deleted = false;
    const errorsLog: string[] = [];

    // 2. Delete enquiry with database client fallback
    if (process.env.DATABASE_URL) {
      try {
        console.log("Deleting enquiry via direct PostgreSQL connection pool.");
        const sql = `
          DELETE FROM enquiries
          WHERE id = $1
          RETURNING *;
        `;
        const result = await query(sql, [id]);
        if (result.rowCount === 0) {
          return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
        }
        deleted = true;
        console.log(`Successfully deleted enquiry via PostgreSQL connection.`);
      } catch (dbError: any) {
        const msg = `PostgreSQL delete query failed: ${dbError.message || dbError}`;
        console.error(msg, dbError);
        errorsLog.push(msg);
      }
    }

    if (!deleted) {
      try {
        console.log("Deleting enquiry via Supabase Admin JS client.");
        const supabaseAdmin = getSupabaseAdmin();
        
        console.log(`DEBUG: Executing Supabase Admin DELETE query for ID: ${id}...`);
        
        const { data, error } = await supabaseAdmin
          .from("enquiries")
          .delete()
          .eq("id", id)
          .select();

        console.log("DEBUG: Supabase Admin DELETE query finished. Raw Response:", {
          hasData: !!data,
          dataLength: data ? data.length : null,
          deletedRow: data ? data[0] : null,
          error: error ? { message: error.message, details: error.details, hint: error.hint, code: error.code } : null
        });

        if (error) {
          console.error("Supabase Admin delete error details:", error);
          errorsLog.push(`Supabase delete query failed: ${error.message || JSON.stringify(error)}`);
        } else if (!data || data.length === 0) {
          return NextResponse.json({ error: "Enquiry not found or already deleted." }, { status: 404 });
        } else {
          deleted = true;
          console.log(`Successfully deleted enquiry via Supabase Admin Client.`);
        }
      } catch (sbError: any) {
        const msg = `Supabase Admin delete client instantiation/execution failed: ${sbError.message || sbError}`;
        console.error(msg, sbError);
        errorsLog.push(msg);
      }
    }

    if (!deleted) {
      return NextResponse.json(
        {
          error: "Database delete failed completely.",
          details: errorsLog.join(" | "),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Unexpected error in DELETE /api/admin/enquiries/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || String(error) },
      { status: 500 }
    );
  }
}


