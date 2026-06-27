import json

def load_jsonl(file_path):
    candidates = []

    with open(file_path, "r", encoding="utf-8-sig") as f:
        for i, line in enumerate(f):
            line = line.strip()
            if not line:
                continue
            try:
                candidates.append(json.loads(line))
            except json.JSONDecodeError:
                print(f"Skipping invalid JSON on line {i+1}: {repr(line[:80])}")

    return candidates