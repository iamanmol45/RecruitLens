import { getCandidates } from "@/data/loader";
import AnalyticsClient from "./client";

export default function AnalyticsPage() {
  const candidates = getCandidates();
  return <AnalyticsClient candidates={candidates} />;
}
