"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/hours");
      router.refresh();
    } else {
      setError("Onjuist wachtwoord");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-espresso/10 bg-cream p-8 shadow-card"
      >
        <h1 className="font-heading mb-2 text-2xl font-semibold text-espresso">
          Admin
        </h1>
        <p className="mb-6 text-sm text-espresso-soft">
          Log in om het menu en openingstijden te beheren.
        </p>

        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-espresso"
        >
          Wachtwoord
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full min-h-[48px] rounded-lg border border-espresso/15 bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-espresso-soft/50 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] rounded-lg bg-espresso px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-espresso-soft disabled:opacity-50"
        >
          {loading ? "Bezig…" : "Inloggen"}
        </button>
      </form>
    </div>
  );
}
