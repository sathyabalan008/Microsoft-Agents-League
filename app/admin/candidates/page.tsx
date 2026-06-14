
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ElectionType =
  | "Political Election"
  | "TV / Channel Voting"
  | "Person / Leader Voting"
  | "Organization / Internal Election"
  | "Custom Election";

type ElectionSetupData = {
  electionName: string;
  description: string;
  conductedBy: string;
  website: string;
  electionType: ElectionType;
  ballotTemplate: string;
  status: string;
  startDate: string;
  endDate: string;
  ballotPath: string;
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

const ELECTION_KEY = "ecc_election_setup";
const OPTIONS_KEY = "ecc_ballot_options";

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

function getLabels(electionType: ElectionType) {
  switch (electionType) {
    case "Political Election":
      return {
        pageTitle: "Candidate Setup",
        pageHint: "Add all parties and leaders that should appear on the ballot.",
        primary: "Party Name",
        secondary: "Leader Name",
        tertiary: "Coalition Name",
        description: "Slogan",
        image: "Party Logo / Symbol URL",
      };
    case "TV / Channel Voting":
      return {
        pageTitle: "Channel Setup",
        pageHint: "Add each channel or media option for the ballot.",
        primary: "Channel Name",
        secondary: "Category / Genre",
        tertiary: "Brand Line",
        description: "Description / Tagline",
        image: "Channel Logo URL",
      };
    case "Person / Leader Voting":
      return {
        pageTitle: "Ballot Option Setup",
        pageHint: "Add each person option for the ballot.",
        primary: "Person Name",
        secondary: "Role / Title",
        tertiary: "Organization / Team",
        description: "Message / Slogan",
        image: "Profile Image URL",
      };
    case "Organization / Internal Election":
      return {
        pageTitle: "Ballot Option Setup",
        pageHint: "Add nominees or options for the internal election.",
        primary: "Option / Candidate Name",
        secondary: "Department / Group",
        tertiary: "Designation / Team",
        description: "Description",
        image: "Logo / Image URL",
      };
    default:
      return {
        pageTitle: "Custom Ballot Setup",
        pageHint: "Define the exact ballot options for this election.",
        primary: "Primary Title",
        secondary: "Secondary Label",
        tertiary: "Third Label",
        description: "Description",
        image: "Image / Logo URL",
      };
  }
}

export default function CandidateSetupPage() {
  const router = useRouter();

  const [electionType, setElectionType] = useState<ElectionType>("Political Election");
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [tertiary, setTertiary] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [options, setOptions] = useState<BallotOption[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const setup = loadJson<ElectionSetupData | null>(ELECTION_KEY, null);
    if (setup?.electionType) {
      setElectionType(setup.electionType);
    }
    setOptions(loadJson<BallotOption[]>(OPTIONS_KEY, []));
  }, []);

  const labels = useMemo(() => getLabels(electionType), [electionType]);

  function resetForm() {
    setPrimary("");
    setSecondary("");
    setTertiary("");
    setDescription("");
    setImageUrl("");
    setDisplayOrder("");
  }

  function handleAddParty(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!primary.trim() || !secondary.trim()) {
      setMessage("Please enter at least the main party/option name and secondary field before adding.");
      return;
    }

    const newOption: BallotOption = {
      id: Date.now(),
      electionType,
      primary: primary.trim(),
      secondary: secondary.trim(),
      tertiary: tertiary.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      displayOrder: displayOrder.trim(),
    };

    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    saveJson(OPTIONS_KEY, updatedOptions);
    setMessage("Party / ballot option added successfully.");
    resetForm();
  }

  function handleRemoveOption(id: number) {
    const updated = options.filter((item) => item.id !== id);
    setOptions(updated);
    saveJson(OPTIONS_KEY, updated);
    setMessage("Party / ballot option removed.");
  }

  function handleGoNext() {
    router.push("/admin/booth");
  }

  return (
    <main className="min-h-screen bg-[#000b2e] px-4 py-8 text-white md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin/elections" className="mb-6 inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200">
          <span aria-hidden="true">←</span>
          <span>Back to Election Setup</span>
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">Candidate Setup</p>
              <h1 className="mt-2 text-3xl font-bold">{labels.pageTitle}</h1>
              <p className="mt-3 text-slate-600">{labels.pageHint}</p>
            </div>

            <form onSubmit={handleAddParty} className="space-y-8" autoComplete="off">
              <section>
                <h2 className="text-lg font-semibold text-slate-900">Ballot Structure</h2>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Election Type</label>
                    <input
                      type="text"
                      value={electionType}
                      readOnly
                      className="w-full rounded-md border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Display Order</label>
                    <input
                      type="number"
                      min="1"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(e.target.value)}
                      placeholder="1"
                      className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-900">Party / Ballot Option Details</h2>
                <div className="mt-4 grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{labels.primary}</label>
                    <input
                      type="text"
                      value={primary}
                      onChange={(e) => setPrimary(e.target.value)}
                      placeholder={`Enter ${labels.primary.toLowerCase()}`}
                      className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">{labels.secondary}</label>
                      <input
                        type="text"
                        value={secondary}
                        onChange={(e) => setSecondary(e.target.value)}
                        placeholder={`Enter ${labels.secondary.toLowerCase()}`}
                        className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">{labels.tertiary}</label>
                      <input
                        type="text"
                        value={tertiary}
                        onChange={(e) => setTertiary(e.target.value)}
                        placeholder={`Enter ${labels.tertiary.toLowerCase()}`}
                        className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{labels.description}</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={`Enter ${labels.description.toLowerCase()}`}
                      rows={4}
                      className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{labels.image}</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.png"
                      className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                    />
                  </div>
                </div>
              </section>

              {message ? (
                <div className={`rounded-md px-4 py-3 text-sm ${message.toLowerCase().includes("successfully") ? "border border-green-200 bg-green-50 text-green-700" : message.toLowerCase().includes("removed") ? "border border-amber-200 bg-amber-50 text-amber-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
                  {message}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-4">
                <button type="submit" className="rounded-md bg-cyan-600 px-6 py-3 font-medium text-white hover:bg-cyan-700">
                  Add Party / Option
                </button>

                <button type="button" onClick={handleGoNext} className="rounded-md border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50">
                  Next: Booth QR
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">Ballot Preview List</p>
                <h2 className="mt-2 text-2xl font-bold">Added Parties / Options</h2>
                <p className="mt-2 text-slate-600">These options will appear on the Booth QR and Ballot page.</p>
              </div>
              <div className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700">{options.length} Added</div>
            </div>

            <div className="mt-6 space-y-4">
              {options.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                  No parties / options added yet.
                </div>
              ) : (
                options
                  .slice()
                  .sort((a, b) => Number(a.displayOrder || 9999) - Number(b.displayOrder || 9999))
                  .map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                            {item.electionType}
                          </div>
                          <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.primary}</h3>
                          <p className="mt-1 text-sm text-slate-600">{item.secondary || "—"}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.tertiary || "—"}</p>
                        </div>
                        <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">Order {item.displayOrder || "—"}</div>
                      </div>
                      <p className="mt-4 text-sm text-slate-700">{item.description || "No description"}</p>
                      <button type="button" onClick={() => handleRemoveOption(item.id)} className="mt-4 text-sm font-medium text-red-600 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
