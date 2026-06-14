"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@election.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setError("");
    router.push("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Home
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="mt-3 text-slate-300">
              Access the election control panel to create elections, add
              candidates, monitor voter activity, and review results.
            </p>

            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">
              Demo credentials are pre-filled for the hackathon preview.
            </div>

            <div className="mt-8 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl bg-slate-950 p-4">
                <span className="font-medium text-white">Email:</span>{" "}
                admin@election.com
              </div>
              <div className="rounded-2xl bg-slate-950 p-4">
                <span className="font-medium text-white">Password:</span>{" "}
                Admin@123
              </div>
            </div>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-8"
          >
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              placeholder="Enter admin email"
            />

            <label className="mb-2 mt-6 block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              placeholder="Enter password"
            />

            {error ? (
              <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}