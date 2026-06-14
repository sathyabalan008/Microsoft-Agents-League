"use client";

import { useMemo, useState } from "react";

type Candidate = {
  id: string;
  ticket: string;
  label: string;
  shortCode: string;
  color: string;
  accent: string;
  runningMate?: string;
};

const CANDIDATES: Candidate[] = [
  {
    id: "ticket-01",
    ticket: "Presidential Ticket 01",
    label: "National Unity Slate",
    shortCode: "01",
    color: "from-blue-600 to-blue-400",
    accent: "bg-blue-600",
    runningMate: "Vice Presidential Running Mate 01",
  },
  {
    id: "ticket-02",
    ticket: "Presidential Ticket 02",
    label: "Forward America Slate",
    shortCode: "02",
    color: "from-red-600 to-red-400",
    accent: "bg-red-600",
    runningMate: "Vice Presidential Running Mate 02",
  },
  {
    id: "ticket-03",
    ticket: "Independent Ticket 03",
    label: "Independent Reform Slate",
    shortCode: "03",
    color: "from-slate-600 to-slate-400",
    accent: "bg-slate-700",
    runningMate: "Vice Presidential Running Mate 03",
  },
];

export default function BallotPage() {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [totalVotes, setTotalVotes] = useState(24816);

  const selectedCandidate = useMemo(() => {
    return CANDIDATES.find((candidate) => candidate.id === selectedCandidateId) || null;
  }, [selectedCandidateId]);

  const handleVote = async (candidateId: string) => {
    if (submitting || voteSubmitted) return;

    setSelectedCandidateId(candidateId);
    setSubmitting(true);

    try {
      const voteRecord = {
        candidateId,
        votedAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        const existingVotes = JSON.parse(localStorage.getItem("us_mock_votes") || "[]");
        existingVotes.push(voteRecord);
        localStorage.setItem("us_mock_votes", JSON.stringify(existingVotes));
      }

      setTimeout(() => {
        setTotalVotes((prev) => prev + 1);
        setVoteSubmitted(true);
        setSubmitting(false);
      }, 700);
    } catch (error) {
      console.error("Vote submission failed:", error);
      setSubmitting(false);
      alert("Unable to submit vote. Please try again.");
    }
  };

  if (voteSubmitted && selectedCandidate) {
    return (
      <main className="min-h-screen bg-[#071b4a] px-3 py-6">
        <div className="mx-auto max-w-md overflow-hidden rounded-[42px] border-[10px] border-[#2d2d2d] bg-[#0d1118] shadow-[0_0_60px_rgba(0,0,0,0.55)]">
          {/* Top bar */}
          <div className="border-b border-white/10 bg-[#080c12] px-4 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-black tracking-[0.08em] text-white">
                US MOCK VOTE
              </div>
              <div className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-200">
                Votes: {totalVotes.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Success */}
          <div className="px-5 py-10 bg-[linear-gradient(180deg,#111827_0%,#0d1118_100%)]">
            <div className="rounded-[28px] border border-emerald-500/30 bg-[#121924] p-8 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-600 text-5xl text-white shadow-lg">
                ✓
              </div>

              <h1 className="mt-6 text-3xl font-extrabold text-white">
                Vote Submitted
              </h1>

              <p className="mt-3 text-gray-300">
                Your ballot has been recorded for this mock election.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#1a2230] p-4 text-left">
                <p className="text-sm text-gray-400">Selected Ticket</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {selectedCandidate.ticket}
                </p>
                <p className="text-sm text-blue-200">{selectedCandidate.label}</p>
                {selectedCandidate.runningMate ? (
                  <p className="mt-2 text-xs text-gray-400">
                    Running mate: {selectedCandidate.runningMate}
                  </p>
                ) : null}
              </div>

              <button
                onClick={() => {
                  setVoteSubmitted(false);
                  setSelectedCandidateId(null);
                }}
                className="mt-6 w-full rounded-xl bg-white py-3 text-lg font-bold text-[#0d1118] transition hover:bg-slate-100"
              >
                Back to Ballot
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071b4a] px-3 py-6">
      <div className="mx-auto max-w-md overflow-hidden rounded-[42px] border-[10px] border-[#2d2d2d] bg-[#0d1118] shadow-[0_0_60px_rgba(0,0,0,0.55)]">
        {/* Header */}
        <div className="border-b border-white/10 bg-[#080c12] px-4 pt-5 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xl font-black tracking-[0.08em] text-white">
                US MOCK VOTE
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-blue-300">
                Mobile ballot
              </div>
            </div>

            <div className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-200">
              Votes: {totalVotes.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="bg-[linear-gradient(180deg,#111827_0%,#0d1118_100%)] px-4 py-5">
          {/* Badge */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/70 bg-[#0f172a] shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b91c1c_0%,#ffffff_50%,#1d4ed8_100%)] text-2xl font-black text-[#0d1118]">
                USA
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-[1.9rem] font-extrabold leading-tight text-white">
              US Presidential Mock Election
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Select one ticket to cast your vote
            </p>
          </div>

          {/* Election ribbon */}
          <div className="mt-5 overflow-hidden rounded-lg border border-blue-500/40">
            <div className="flex">
              <div className="shrink-0 bg-[#b91c1c] px-3 py-2 text-sm font-bold text-white">
                LIVE BALLOT
              </div>
              <div className="flex-1 bg-[#0f172a] px-3 py-2 text-sm font-semibold text-blue-100">
                National mock election demo • Secure ballot interface • One selection only
              </div>
            </div>
          </div>

          {/* Candidate cards */}
          <div className="mt-6 space-y-4">
            {CANDIDATES.map((candidate, index) => (
              <div
                key={candidate.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#151c28] shadow-lg"
              >
                <div className="relative p-4">
                  <div className="absolute left-2 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black text-xs font-bold text-white">
                    {index + 1}
                  </div>

                  <div className="grid grid-cols-[62px_1fr_68px] items-center gap-3 pl-5">
                    {/* Ticket badge */}
                    <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${candidate.color} text-xl font-black text-white shadow-md`}>
                      {candidate.shortCode}
                    </div>

                    {/* Details */}
                    <div className="text-left">
                      <h2 className="text-[1.2rem] font-extrabold leading-tight text-white">
                        {candidate.ticket}
                      </h2>
                      <p className="mt-1 text-sm text-blue-100">
                        {candidate.label}
                      </p>

                      {candidate.runningMate ? (
                        <div className="mt-2 inline-block rounded-md bg-[#263142] px-3 py-1 text-[11px] text-slate-300">
                          {candidate.runningMate}
                        </div>
                      ) : null}
                    </div>

                    {/* Vote icon area */}
                    <div className="flex justify-end">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-[#1f2937] text-white">
                        <div className={`h-10 w-10 rounded-full ${candidate.accent} shadow-[0_0_18px_rgba(255,255,255,0.15)]`} />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleVote(candidate.id)}
                  disabled={submitting || voteSubmitted}
                  className="w-full bg-[linear-gradient(90deg,#b91c1c_0%,#dc2626_50%,#1d4ed8_100%)] py-4 text-2xl font-extrabold tracking-wide text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && selectedCandidateId === candidate.id
                    ? "SUBMITTING..."
                    : voteSubmitted
                    ? "VOTED"
                    : "CAST VOTE"}
                </button>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-6 rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-center text-sm text-slate-400">
            Demo ballot interface for a US mock election • One voter can cast one vote only
          </div>
        </div>
      </div>
    </main>
  );
}