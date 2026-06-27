import { getCandidates } from "@/data/loader";
import CandidateProfileClient from "./client";

export default async function CandidateProfilePage({ params }: { params: Promise<{ candidateId: string }> }) {
  const candidates = getCandidates();
  
  // Await the params object in Next.js 15+
  const resolvedParams = await params;
  
  // Find the exact candidate by ID. Decode in case of URL encoding.
  const candidateId = decodeURIComponent(resolvedParams.candidateId);
  const candidate = candidates.find(c => c.candidate_id === candidateId);

  if (!candidate) {
    return <div className="p-8 text-center text-white">Candidate not found.</div>;
  }

  const rank = candidates.findIndex(c => c.candidate_id === candidateId) + 1;
  const totalCandidates = candidates.length;

  return <CandidateProfileClient candidate={candidate} rank={rank} totalCandidates={totalCandidates} />;
}
