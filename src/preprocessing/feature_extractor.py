def extract_features(candidate):

    profile = candidate["profile"]
    signals = candidate["redrob_signals"]

    features = {

        "candidate_id":
            candidate["candidate_id"],

        "years_experience":
            profile["years_of_experience"],

        "num_skills":
            len(candidate["skills"]),

        "num_certifications":
            len(candidate.get("certifications", [])),

        "num_languages":
            len(candidate.get("languages", [])),

        "github_score":
            signals["github_activity_score"],

        "profile_completeness":
            signals["profile_completeness_score"],

        "response_rate":
            signals["recruiter_response_rate"],

        "interview_completion":
            signals["interview_completion_rate"],

        "saved_by_recruiters":
            signals["saved_by_recruiters_30d"],

        "search_appearances":
            signals["search_appearance_30d"],

        "open_to_work":
            int(signals["open_to_work_flag"]),

        "verified_email":
            int(signals["verified_email"]),

        "verified_phone":
            int(signals["verified_phone"]),

        "linkedin_connected":
            int(signals["linkedin_connected"]),

        "notice_period":
            signals["notice_period_days"]
    }

    return features