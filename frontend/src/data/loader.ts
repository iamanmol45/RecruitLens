import fs from 'fs';
import path from 'path';

export interface Candidate {
  hidden_gem: boolean;
  candidate_id: string;
  title: string;
  final_score: number;
  match_score: number;
  behavior_score: number;
  trajectory_score: number;
  semantic_score: number;
  risk_level: string;
  future_potential: string;
  archetype: string;
  growth_type: string;
  leadership_growth: boolean;
  years_experience: number;
  hidden_gem_reason: string;
  missing_skills: string[];
  risks: string[];
  reasons: string[];
  upskilling_effort: string;
  honeypot: boolean;
  honeypot_status: string;
  honeypot_score: number;
  honeypot_reasons: string[];
}

export function getCandidates(): Candidate[] {
  try {
    const filePath = path.join(process.cwd(), '../outputs/ranked_candidates.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as Candidate[];
  } catch (error) {
    console.error("Failed to load candidates:", error);
    return [];
  }
}
