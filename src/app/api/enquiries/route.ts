import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, name, email, phone, place, message } = body;

    // Validate inputs
    if (!category || !name || !email || !phone || !place || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const categories = ["ZeeSip", "Zee Chai", "Eallisto", "General"];
    if (!categories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category selected." },
        { status: 400 }
      );
    }

    // Insert enquiry
    const sql = `
      INSERT INTO enquiries (category, name, email, phone, place, message, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'New')
      RETURNING *;
    `;
    const params = [category, name, email, phone, place, message];
    const result = await query(sql, params);

    return NextResponse.json(
      { success: true, enquiry: result.rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/enquiries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
