"use client";

import Link from "next/link";

const managers = [
  {
    id: 1,
    name: "Election Manager 01",
    email: "manager01@demo.com",
    role: "Election Manager",
    status: "Active",
  },
  {
    id: 2,
    name: "Template Manager",
    email: "template@demo.com",
    role: "Template Manager",
    status: "Active",
  },
  {
    id: 3,
    name: "Results Viewer",
    email: "reports@demo.com",
    role: "Results Viewer",
    status: "Inactive",
  },
];

export default function UserManagementPage() {
  return (
    <main className="min-h-screen bg-[#000b2e] px-4 py-8 text-white md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Admin Dashboard</span>
        </Link>

        <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl md:p-8">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                User Management
              </p>
              <h1 className="mt-2 text-3xl font-bold">Election Manager Portal</h1>
              <p className="mt-3 text-slate-600">
                This page is now created, so the dashboard button no longer shows 404.
                Later we can connect Microsoft Entra groups, roles, and real access management.
              </p>
            </div>

            <button
              type="button"
              className="rounded-md bg-cyan-600 px-5 py-3 text-sm font-medium text-white hover:bg-cyan-700"
            >
              Add Election Manager
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[1.4fr_1.4fr_1fr_0.8fr] gap-4 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
            </div>

            <div className="divide-y divide-slate-200">
              {managers.map((manager) => (
                <div
                  key={manager.id}
                  className="grid grid-cols-[1.4fr_1.4fr_1fr_0.8fr] gap-4 px-5 py-4 text-sm"
                >
                  <div className="font-medium text-slate-900">{manager.name}</div>
                  <div className="text-slate-600">{manager.email}</div>
                  <div className="text-slate-700">{manager.role}</div>
                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        manager.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {manager.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}