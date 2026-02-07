---
name: scaffold-dataset-metadata
description: Adds dataset metadata entries for discovery and UI display. Use when registering new datasets or updating dataset catalogs.
---
# Scaffold Dataset Metadata

## Instructions
1. Find the existing dataset metadata/index format in apps/trader or configs.
2. Add a new entry for the dataset (symbol, timeframe, date range, source).
3. Ensure the dataset path and schema match existing ingestion rules.
4. Update any UI store or API route that lists datasets.

## Checklist
- [ ] Metadata entry added
- [ ] Path/schema validated
- [ ] Dataset list updated

## Example triggers
- "Register a new dataset"
- "Add dataset metadata"
