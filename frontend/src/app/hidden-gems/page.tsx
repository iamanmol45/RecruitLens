import { getCandidates } from "@/data/loader";
import HiddenGemsClient from "./client";

export default function HiddenGemsPage() {
  const candidates = getCandidates();
  return <HiddenGemsClient allCandidates={candidates} />;
}
