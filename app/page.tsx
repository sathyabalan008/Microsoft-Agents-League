"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password.");
      return;
    }

    setError("");
    router.push("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#000b2e] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 text-slate-900 shadow-2xl">
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-cyan-600 text-lg font-bold text-white">
              E
            </div>
            <div>
              <p className="text-sm text-slate-500">Election Command Center</p>
              <h1 className="text-2xl font-semibold">Sign in</h1>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            Use your admin account to access Election Setup, Booth QR, Results,
            and User Management.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourorg.com"
              className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-600"
            />
          </div>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-md bg-cyan-600 px-4 py-3 font-medium text-white transition hover:bg-cyan-700"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
          Microsoft Entra ID style login screen (UI preview).
        </div>
      </div>
    </main>
  );
}