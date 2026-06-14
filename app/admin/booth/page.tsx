"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type ElectionSetupData = {
  electionName: string;
  description: string;
  conductedBy: string;
  website: string;
  electionType: string;
  ballotTemplate: string;
  status: string;
  startDate: string;
  endDate: string;
  ballotPath: string;
};

type BallotOption = {
  id: number;
  electionType: string;
  primary: string;
  secondary: string;
  tertiary: string;
  description: string;
  imageUrl: string;
  displayOrder: string;
};

type CellProps = {
  filled: boolean;
};

function QrCell({ filled }: CellProps) {
  return <div className={filled ? "bg-slate-950" : "bg-white"} />;
}

function getDisplayLogoText(conductedBy: string) {
  const parts = conductedBy
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (parts.length === 0) return "ORG";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function createPseudoQrMatrix(size: number, seed: string) {
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));

  function placeFinder(startRow: number, startCol: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const row = startRow + r;
        const col = startCol + c;
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[row][col] = isOuter || isInner;
      }
    }
  }

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 7 && c < 7;
      const inTopRight = r < 7 && c >= size - 7;
      const inBottomLeft = r >= size - 7 && c < 7;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      hash = (1664525 * hash + 1013904223) >>> 0;
      matrix[r][c] = ((hash >> 28) & 1) === 1;
    }
  }

  return matrix;
}

export default function BoothQrPage() {
  const [loaded, setLoaded] = useState(false);
  const [ballotUrl, setBallotUrl] = useState("/ballot");

  const setup = loadJson<ElectionSetupData | null>("ecc_election_setup", null);
  const options = loadJson<BallotOption[]>("ecc_ballot_options", []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBallotUrl(`${window.location.origin}/ballot`);
      setLoaded(true);
    }
  }, []);

  const electionName = setup?.electionName || "Election not set up yet";
  const electionDescription =
    setup?.description || "Complete Election Setup and Candidate Setup first.";
  const conductedBy = setup?.conductedBy || "Organization";
  const logoText = getDisplayLogoText(conductedBy);

  const flashNews = loaded
    ? `FLASH NEWS: Voting access is ready. Scan the QR code or open the voter page link to cast your vote in ${electionName}.`
    : "FLASH NEWS: Loading booth QR preview...";

  const qrMatrix = useMemo(
    () => createPseudoQrMatrix(29, ballotUrl),
    [ballotUrl]
  );

  return (
    <main className="min-h-screen bg-[#000b2e] text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
          >
            <span aria-hidden="true">←</span>
            <span>Back to Admin Dashboard</span>
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/candidates"
              className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Back: Candidate Setup
            </Link>
            <Link
              href="/ballot"
              className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Open Ballot
            </Link>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-2xl border border-red-400/30 bg-red-500/10">
          <div className="flex items-center gap-4 px-4 py-3 md:px-6">
            <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold tracking-wide text-white">
              FLASH NEWS
            </div>
            <div className="min-w-0 overflow-hidden">
              <div className="whitespace-nowrap text-sm font-medium text-red-100 animate-[marquee_18s_linear_infinite]">
                {flashNews}
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Advertisement Left
            </p>
            <div className="mt-4 flex h-[580px] items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-white/70">
              Keep this space for sponsor graphics or TV branding.
            </div>
          </aside>

          <div className="rounded-[32px] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl md:p-8 xl:p-10">
            <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  Booth QR Live Page
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                    {logoText}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                      {electionName}
                    </h1>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Conducted by {conductedBy}
                    </p>
                  </div>
                </div>

                <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                  {electionDescription}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Voting Status
                    </p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">
                      {setup?.status || "Draft"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Ballot Options Ready
                    </p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">
                      {options.length}
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-3xl border border-cyan-200 bg-cyan-50 p-5">
                  <p className="text-sm font-semibold text-cyan-800">
                    How viewers should vote
                  </p>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-cyan-900">
                    <li>Open the camera app on the mobile device.</li>
                    <li>Scan the large QR code shown on the live page.</li>
                    <li>Tap the ballot link and open the voter page.</li>
                    <li>Select one ballot option and submit the vote.</li>
                  </ol>
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Voter Page Link
                  </p>
                  <a
                    href={ballotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block break-all text-base font-medium text-cyan-700 underline underline-offset-4"
                  >
                    {ballotUrl}
                  </a>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 md:p-8">
                <div className="mb-5 text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Scan to Vote
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Public Ballot QR
                  </h2>
                </div>

                <div className="mx-auto aspect-square w-full max-w-[420px] rounded-[32px] border border-slate-200 bg-white p-5 shadow-inner">
                  <div
                    className="grid h-full w-full gap-[2px] rounded-2xl bg-white p-2"
                    style={{
                      gridTemplateColumns: `repeat(${qrMatrix.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {qrMatrix.flatMap((row, rowIndex) =>
                      row.map((filled, colIndex) => (
                        <QrCell
                          key={`${rowIndex}-${colIndex}`}
                          filled={filled}
                        />
                      ))
                    )}
                  </div>
                </div>

                <p className="mt-5 text-center text-sm text-slate-500">
                  QR preview connected to the Ballot page route.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Advertisement Right
            </p>
            <div className="mt-4 flex h-[580px] items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-white/70">
              Keep this area for partner banners or TV branding.
            </div>
          </aside>
        </section>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </main>
  );
}