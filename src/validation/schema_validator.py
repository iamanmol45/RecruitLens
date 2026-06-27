import json
from jsonschema import Draft7Validator


def validate_candidates(candidates, schema_path):

    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)

    validator = Draft7Validator(schema)

    valid = 0
    invalid = 0

    for i, candidate in enumerate(candidates):

        if i % 1000 == 0:
            print(f"Validated {i}")

        errors = list(validator.iter_errors(candidate))

        if len(errors) == 0:
            valid += 1
        else:
            invalid += 1

    return {
        "valid_profiles": valid,
        "invalid_profiles": invalid
    }