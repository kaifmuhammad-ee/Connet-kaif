import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    const categories = [
      "ZeeSip",
      "Zee Chai",
      "Eallisto",
      "Le Weekend",
      "Kinford School",
      "General",
    ];
    if (!categories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category selected." },
        { status: 400 }
      );
    }

    // Insert enquiry using Supabase JS client
    const { data, error } = await supabase
      .from("enquiries")
      .insert([
        {
          category,
          name,
          email,
          phone,
          place,
          message,
          status: "New",
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error details:", error);
      return NextResponse.json(
        { error: `Database insert failed: ${error.message || JSON.stringify(error)}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, enquiry: data ? data[0] : null },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Unexpected error in POST /api/enquiries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
