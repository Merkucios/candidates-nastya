export const CANDIDATE_STORAGE_KEY = "candidateId";

export function saveCandidateId(id: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CANDIDATE_STORAGE_KEY, id);
}

export function getCandidateId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(CANDIDATE_STORAGE_KEY);
}

export function clearCandidateId() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CANDIDATE_STORAGE_KEY);
}
