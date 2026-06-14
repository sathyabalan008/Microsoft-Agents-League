"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ElectionType =
  | "Political Election"
  | "TV / Channel Voting"
  | "Person / Leader Voting"
  | "Organization / Internal Election"
  | "Custom Election";

type ElectionStatus = "Draft" | "Active" | "Paused" | "Closed";

type ElectionForm = {
  electionName: string;
  description: string;
  conductedBy: string;
  website: string;
  electionType: ElectionType;
  ballotTemplate: string;
  status: ElectionStatus;
  startDate: string;
  endDate: string;
};

type BallotOption = {
  id: number;
  electionType: ElectionType;
  primary: string;
  secondary: string;
  tertiary: string;
  description: string;
  imageUrl: string;
  displayOrder: string;
};

type SharedCandidate = {
  id: string;
  name: string;
  party: string;
  symbol: string;
  period?: string;
  photo?: string;
};

type SharedElection = {
  id: string;
  title: string;
  subtitle: string;
  status: "draft" | "started" | "paused" | "stopped";
  totalVotes: number;
  startDate: string;
  endDate: string;
  conductedBy: string;
  website: string;
  candidates: SharedCandidate[];
};

const FORM_KEY = "ecc_election_setup_form_draft";
const ELECTION_KEY = "ecc_election_setup";
const OPTIONS_KEY = "ecc_ballot_options";
const ACTIVE_ELECTION_KEY = "activeElection";
const ELECTIONS_KEY = "elections";
const DEMO_VOTES_KEY = "demo_votes";

const defaultForm: ElectionForm = {
  electionName: "US Presidential Mock Election",
  description: "MVP election flow with a default US presidential ballot preset.",
  conductedBy: "Enterprise Election Control Center",
  website: "https://example.com",
  electionType: "Political Election",
  ballotTemplate: "Presidential Ticket Layout",
  status: "Draft",
  startDate: "",
  endDate: "",
};

const defaultBallot: BallotOption[] = [
  {
    id: 1001,
    electionType: "Political Election",
    primary: "National Unity Slate",
    secondary: "Presidential Ticket 01",
    tertiary: "Vice Presidential Running Mate 01",
    description: "Default US mock ballot option.",
    imageUrl: "",
    displayOrder: "1",
  },
  {
    id: 1002,
    electionType: "Political Election",
    primary: "Forward America Slate",
    secondary: "Presidential Ticket 02",
    tertiary: "Vice Presidential Running Mate 02",
    description: "Default US mock ballot option.",
    imageUrl: "",
    displayOrder: "2",
  },
  {
    id: 1003,
    electionType: "Political Election",
    primary: "Independent Reform Slate",
    secondary: "Independent Ticket 03",
    tertiary: "Vice Presidential Running Mate 03",
    description: "Default US mock ballot option.",
    imageUrl: "",
    displayOrder: "3",
  },
];

const ballotCandidates: SharedCandidate[] = [
  {
    id: "ticket-01",
    name: "Presidential Ticket 01",
    party: "National Unity Slate",
    symbol: "01",
    period: "Vice Presidential Running Mate 01",
    photo: "https://via.placeholder.com/96x96.png?text=01",
  },
  {
    id: "ticket-02",
    name: "Presidential Ticket 02",
    party: "Forward America Slate",
    symbol: "02",
    period: "Vice Presidential Running Mate 02",
    photo: "https://via.placeholder.com/96x96.png?text=02",
  },
  {
    id: "ticket-03",
    name: "Independent Ticket 03",
    party: "Independent Reform Slate",
    symbol: "03",
    period: "Vice Presidential Running Mate 03",
    photo: "https://via.placeholder.com/96x96.png?text=03",
  },
];

function loadJson<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createSharedElection(
  form: ElectionForm,
  status: SharedElection["status"]
): SharedElection {
  return {
    id: "us-presidential-mvp",
    title: "US Presidential Mock Election",
    subtitle: "Select one ticket to cast your vote",
    status,
    totalVotes: 24816,
    startDate: form.startDate,
    endDate: form.endDate,
    conductedBy: form.conductedBy,
    website: form.website,
    candidates: ballotCandidates,
  };
}

export default function ElectionSetupPage() {
  const router = useRouter();

  const [form, setForm] = useState<ElectionForm>(defaultForm);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<"start" | "pause" | "stop" | null>(null);

  useEffect(() => {
    const saved = loadJson<ElectionForm>(FORM_KEY, defaultForm);
    setForm({ ...defaultForm, ...saved });
  }, []);

  useEffect(() => {
    saveJson(FORM_KEY, form);
  }, [form]);

  function update<K extends keyof ElectionForm>(key: K, value: ElectionForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (message) setMessage("");
  }

  function validateFields() {
    if (
      !form.electionName.trim() ||
      !form.description.trim() ||
      !form.conductedBy.trim() ||
      !form.website.trim() ||
      !form.startDate ||
      !form.endDate
    ) {
      setMessage("Please complete all required fields before continuing.");
      return false;
    }

    if (form.endDate < form.startDate) {
      setMessage("End date cannot be earlier than start date.");
      return false;
    }

    return true;
  }

  function persistAdminElection(nextStatus: ElectionStatus) {
    const payload = {
      ...form,
      status: nextStatus,
      ballotPath: "/ballot",
    };

    saveJson(ELECTION_KEY, payload);
    saveJson(FORM_KEY, { ...form, status: nextStatus });
    setForm((prev) => ({ ...prev, status: nextStatus }));
  }

  function persistSharedElection(sharedElection: SharedElection) {
    saveJson(ACTIVE_ELECTION_KEY, sharedElection);

    const existing = loadJson<SharedElection[]>(ELECTIONS_KEY, []);
    const withoutCurrent = existing.filter((e) => e.id !== sharedElection.id);
    saveJson(ELECTIONS_KEY, [sharedElection, ...withoutCurrent]);
  }

  function seedDefaultBallot() {
    saveJson(OPTIONS_KEY, defaultBallot);
  }

  function clearDemoVotes() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(DEMO_VOTES_KEY);
  }

  function handleStartElection() {
    if (busy !== null) return;
    if (!validateFields()) return;

    setBusy("start");

    persistAdminElection("Active");
    seedDefaultBallot();
    clearDemoVotes();

    const sharedElection = createSharedElection(form, "started");
    persistSharedElection(sharedElection);

    setMessage("Election started successfully. US mock ballot is live and ready.");

    window.setTimeout(() => {
      setBusy(null);
    }, 500);
  }

  function handlePauseElection() {
    if (busy !== null) return;
    if (!validateFields()) return;

    setBusy("pause");

    persistAdminElection("Paused");

    const sharedElection = createSharedElection(form, "paused");
    persistSharedElection(sharedElection);

    setMessage("Election paused successfully.");

    window.setTimeout(() => {
      setBusy(null);
    }, 500);
  }

  function handleStopElection() {
    if (busy !== null) return;
    if (!validateFields()) return;

    setBusy("stop");

    persistAdminElection("Closed");

    const sharedElection = createSharedElection(form, "stopped");
    persistSharedElection(sharedElection);

    setMessage("Election stopped successfully.");

    window.setTimeout(() => {
      setBusy(null);
    }, 500);
  }

  function handleOpenBallot() {
    router.push("/ballot");
  }

  function handleOpenBooth() {
    router.push("/admin/booth");
  }

  return (
    <main className="min-h-screen bg-[#000b2e] px-4 py-8 text-white md:px-6 md:py-10">
      <div className="mx-auto max-w-5xl">
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
              Election Setup
            </p>
            <h1 className="mt-2 text-3xl font-bold">Create Election</h1>
            <p className="mt-3 text-slate-600">
              Start, pause, or stop the election. This version saves a shared
              ballot-ready election object for the public US mock ballot page.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                Basic Information
              </h2>

              <div className="mt-4 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Election Name
                  </label>
                  <input
                    type="text"
                    value={form.electionName}
                    onChange={(e) => update("electionName", e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={4}
                    className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Conducted By
                    </label>
                    <input
                      type="text"
                      value={form.conductedBy}
                      onChange={(e) => update("conductedBy", e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Organizer Website
                    </label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                Election Configuration
              </h2>

              <div className="mt-4 grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Election Type
                  </label>
                  <input
                    type="text"
                    value={form.electionType}
                    readOnly
                    className="w-full rounded-md border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Ballot Template
                  </label>
                  <input
                    type="text"
                    value={form.ballotTemplate}
                    readOnly
                    className="w-full rounded-md border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Current Status
                  </label>
                  <input
                    type="text"
                    value={form.status}
                    readOnly
                    className="w-full rounded-md border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                Election Schedule
              </h2>

              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => update("endDate", e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                  />
                </div>
              </div>
            </section>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">
                Default MVP Ballot Preset
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Presidential Ticket 01</li>
                <li>Presidential Ticket 02</li>
                <li>Independent Ticket 03</li>
              </ul>
            </div>

            {message ? (
              <div
                className={`rounded-md px-4 py-3 text-sm ${
                  message.toLowerCase().includes("successfully") ||
                  message.toLowerCase().includes("live")
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleStartElection}
                disabled={busy !== null}
                className="rounded-md bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {busy === "start" ? "Starting Election..." : "Start Election"}
              </button>

              <button
                type="button"
                onClick={handlePauseElection}
                disabled={busy !== null}
                className="rounded-md bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {busy === "pause" ? "Pausing Election..." : "Pause Election"}
              </button>

              <button
                type="button"
                onClick={handleStopElection}
                disabled={busy !== null}
                className="rounded-md bg-rose-600 px-6 py-3 font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {busy === "stop" ? "Stopping Election..." : "Stop Election"}
              </button>

              <button
                type="button"
                onClick={handleOpenBooth}
                className="rounded-md bg-slate-700 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
              >
                Open Booth QR
              </button>

              <button
                type="button"
                onClick={handleOpenBallot}
                className="rounded-md bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
              >
                Open Ballot
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
