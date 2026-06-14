
"use client";

import { useMemo } from "react";
import { getSavedVote, getElectionSetup } from "@/lib/election-store";

export default function BallotSuccessPage() {
  const vote = getSavedVote();
  const setup = getElectionSetup();

  const voteTime = useMemo(() => {
    if (!vote?.time) return "Recorded";
    const date = new Date(vote.time);
    return date.toLocaleString();
  }, [vote]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#17316f_0%,_#08132f_42%,_#040816_100%)] px-4 py-6 text-white">
      <div className="flex justify-center">
        <div className="w-full max-w-[420px] rounded-[38px] border border-white/10 bg-black/30 p-3 shadow-[0_35px_120px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="flex h-[820px] flex-col items-center justify-center rounded-[32px] bg-slate-100 px-6 text-center text-slate-900">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-4xl text-white shadow-lg">
              ✓
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Vote Recorded
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight">Thank you for voting</h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
              Your vote has been recorded successfully for {setup?.electionName || "this election"}. This ballot session is now complete.
            </p>

            <div className="mt-8 w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">Recorded Selection</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{vote ? `${vote.primary} — ${vote.secondary}` : "Selection stored"}</p>
              <p className="mt-2 text-sm text-slate-500">{voteTime}</p>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
              If this ballot page is opened again on this device, the voter will stay on this completion screen instead of voting again.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
