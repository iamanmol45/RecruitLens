import { getCandidates } from "@/data/loader";
import CompareClient from "./client";

export default function ComparePage() {
  const candidates = getCandidates();
  return <CompareClient allCandidates={candidates} />;
}
