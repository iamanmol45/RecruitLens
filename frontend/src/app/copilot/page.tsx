import { getCandidates } from "@/data/loader";
import CopilotClient from "./client";

export default function CopilotPage() {
  const candidates = getCandidates();
  return <CopilotClient candidates={candidates} />;
}
