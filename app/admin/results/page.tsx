"use client";

import Link from "next/link";

export default function ElectionResultsPage() {
  const results = [
    { name: "Unity Party", votes: 4280 },
    { name: "Future Alliance", votes: 3910 },
    { name: "Liberty Front", votes: 2765 },
    { name: "National Reform Party", votes: 1985 },
  ];

  const totalVotes = results.reduce((sum, item) => sum + item.votes, 0);
  const topVotes = results[0]?.votes ?? 1;

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
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
              Election Reports
            </p>
            <h1 className="mt-2 text-3xl font-bold">Election Results</h1>
            <p className="mt-3 text-slate-600">
              This page is now created, so the dashboard button no longer shows 404.
              Later we can connect live vote storage and real charts.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Total Votes</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{totalVotes}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Leading Option</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {results[0].name}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Result Status</p>
              <p className="mt-3 text-2xl font-bold text-green-600">Live Preview</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Vote Breakdown
              </h2>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700">
                Tables + Percentages
              </span>
            </div>

            <div className="space-y-4">
              {results.map((item) => {
                const percent = ((item.votes / totalVotes) * 100).toFixed(1);
                const barWidth = `${(item.votes / topVotes) * 100}%`;

                return (
                  <div key={item.name} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">
                          {item.votes.toLocaleString()} votes
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">{percent}%</p>
                      </div>
                    </div>

                    <div className="mt-4 h-3 rounded-full bg-slate-200">
                      <div
                        className="h-3 rounded-full bg-cyan-600"
                        style={{ width: barWidth }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}