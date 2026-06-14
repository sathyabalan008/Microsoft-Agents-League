
export type ElectionType =
  | "Political Election"
  | "TV / Channel Voting"
  | "Person / Leader Voting"
  | "Organization / Internal Election"
  | "Custom Election";

export type ElectionStatus = "Draft" | "Scheduled" | "Active" | "Paused" | "Closed";

export type ElectionSetupData = {
  electionName: string;
  description: string;
  conductedBy: string;
  website: string;
  electionType: ElectionType;
  ballotTemplate: string;
  status: ElectionStatus;
  startDate: string;
  endDate: string;
  ballotPath: string;
};

export type BallotOption = {
  id: number;
  electionType: ElectionType;
  primary: string;
  secondary: string;
  tertiary: string;
  description: string;
  imageUrl: string;
  displayOrder: string;
};

export type SavedVote = {
  optionId: number;
  primary: string;
  secondary: string;
  time: string;
};

const ELECTION_SETUP_KEY = "ecc_election_setup";
const BALLOT_OPTIONS_KEY = "ecc_ballot_options";
const VOTED_KEY = "ecc_voted";
const VOTE_DETAILS_KEY = "ecc_vote_details";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function saveElectionSetup(data: ElectionSetupData) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ELECTION_SETUP_KEY, JSON.stringify(data));
}

export function getElectionSetup(): ElectionSetupData | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(ELECTION_SETUP_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ElectionSetupData;
  } catch {
    return null;
  }
}

export function saveBallotOptions(options: BallotOption[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(BALLOT_OPTIONS_KEY, JSON.stringify(options));
}

export function getBallotOptions(): BallotOption[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(BALLOT_OPTIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as BallotOption[];
  } catch {
    return [];
  }
}

export function markVoted(vote: SavedVote) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(VOTED_KEY, "true");
  window.localStorage.setItem(VOTE_DETAILS_KEY, JSON.stringify(vote));
}

export function hasVoted() {
  if (!canUseStorage()) return false;
  return window.localStorage.getItem(VOTED_KEY) === "true";
}

export function getSavedVote(): SavedVote | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(VOTE_DETAILS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedVote;
  } catch {
    return null;
  }
}

export function clearSavedVote() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(VOTED_KEY);
  window.localStorage.removeItem(VOTE_DETAILS_KEY);
}

export function slugifyElectionName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getDisplayLogoText(conductedBy: string) {
  const parts = conductedBy
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (parts.length === 0) return "ORG";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}
