---
name: validate-dataset-schema
description: Validates dataset files against expected schema and time ordering. Use when checking dataset integrity or ingestion errors.
---
# Validate Dataset Schema

## Instructions
1. Identify the expected schema (columns, types, ordering) for the dataset.
2. Validate required columns and timestamp ordering.
3. Check for missing data, duplicate timestamps, and invalid values.
4. Report issues clearly with file names and counts.

## Output format
- Summary of pass/fail
- List of issues with counts and examples

## Example triggers
- "Validate dataset schema"
- "Check data quality"
