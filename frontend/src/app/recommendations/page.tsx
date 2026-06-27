import { getCandidates } from "@/data/loader";
import RecommendationsClient from "./client";

export default function RecommendationsPage() {
  const candidates = getCandidates();
  return <RecommendationsClient allCandidates={candidates} />;
}
