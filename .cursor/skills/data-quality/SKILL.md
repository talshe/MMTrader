---
name: data-quality
description: Validates dataset integrity and flags missing data, outliers, and schema mismatches. Use when adding ingestion checks or data validation logic.
---

# Data Quality

## Quick Start
- Dataset API: `apps/trader/src/routes/datasets.ts`
- Data interfaces: `packages/core/src/providers/data-provider.ts`

## Workflow
1. Define required columns and schema rules.
2. Check for missing ranges, duplicates, and NaNs.
3. Detect outliers using configurable thresholds.
4. Report quality issues alongside dataset metadata.

## Guardrails
- Do not load full datasets for lightweight checks.
- Keep validation rules configurable.
