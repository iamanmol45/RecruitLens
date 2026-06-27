import { getCandidates } from "@/data/loader";
import CandidatesClient from "./client";

export default function CandidatesPage() {
  const candidates = getCandidates();
  return <CandidatesClient allCandidates={candidates} />;
}
