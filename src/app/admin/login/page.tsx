"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Successful login, middleware will now let us visit /admin
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid email or password.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-black font-sans flex flex-col justify-between p-6 md:p-12 selection:bg-black selection:text-[#F5F0E6]">
      {/* Top Header */}
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
        <button 
          onClick={() => router.push("/")}
          className="font-heading text-lg font-black tracking-tight uppercase"
        >
          Kaif Muhammad
        </button>
        <span className="text-xs uppercase tracking-[0.2em] opacity-60">
          Secure Portal
        </span>
      </div>

      {/* Main Login Box */}
      <div className="w-full max-w-md mx-auto my-auto border border-black p-8 md:p-10 bg-[#F5F0E6] shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 border border-black rounded-none flex items-center justify-center mx-auto mb-4 bg-black text-[#F5F0E6]">
            <Lock size={18} />
          </div>
          <h1 className="font-heading font-light text-3xl tracking-wide uppercase">Admin Login</h1>
          <p className="text-xs uppercase tracking-wider text-black/50 mt-2">
            Enter credentials to manage enquiries
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 border border-red-500 text-red-500 text-xs flex items-center gap-2 bg-red-500/5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] font-medium opacity-80">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kaif@gmail.com"
              className="w-full bg-transparent border-b border-black/20 focus:border-black py-3 text-sm outline-none transition-colors rounded-none"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs uppercase tracking-[0.2em] font-medium opacity-80">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-black/20 focus:border-black py-3 text-sm outline-none transition-colors rounded-none"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-[#F5F0E6] font-semibold uppercase tracking-[0.2em] text-xs py-4 hover:bg-[#F5F0E6] hover:text-black border border-black transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs opacity-50 w-full max-w-6xl mx-auto">
        © 2026 Kaif Muhammad. All rights reserved.
      </div>
    </div>
  );
}
