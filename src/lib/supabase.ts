import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  "dummy-key-for-build-purposes";

// Public client for anonymous/public operations (restricted by RLS)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Server-side startup logs to verify environment variables on Render
if (typeof window === "undefined") {
  console.log("=== SUPABASE SERVER-SIDE ENV CHECK ===");
  console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Present" : "Missing");
  
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", anonKey ? `Present (length: ${anonKey.length})` : "Missing");

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.error("CRITICAL ERROR: SUPABASE_SERVICE_ROLE_KEY is missing from server environment variables!");
  } else {
    console.log("SUPABASE_SERVICE_ROLE_KEY:", `Present (length: ${serviceRoleKey.length})`);
    
    // Check if the service key looks like the publishable key or is identical to the anon key
    if (serviceRoleKey.startsWith("sb_publishable_")) {
      console.error("CRITICAL WARNING: SUPABASE_SERVICE_ROLE_KEY starts with 'sb_publishable_'. This is a public key and will result in 0 rows being returned due to RLS select policies!");
    } else if (anonKey && serviceRoleKey === anonKey) {
      console.error("CRITICAL WARNING: SUPABASE_SERVICE_ROLE_KEY is identical to NEXT_PUBLIC_SUPABASE_ANON_KEY. RLS will block all SELECT calls!");
    } else {
      console.log("SUPABASE_SERVICE_ROLE_KEY check: Key starts with correct format (JWT or private key).");
    }
  }

  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Present" : "Missing");
  console.log("======================================");
}

// Admin-specific client for server-side admin operations (bypasses RLS)
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

