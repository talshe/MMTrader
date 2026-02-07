---
name: data-ingestion
description: Handles dataset discovery, metadata extraction, and validation for CSV/Parquet in the trader service. Use when adding data sources, formats, or dataset metadata.
---

# Data Ingestion

## Quick Start
- Dataset API: `apps/trader/src/routes/datasets.ts`
- Data interfaces: `packages/core/src/providers/data-provider.ts`

## Workflow
1. Scan `data/` for files and determine format.
2. Extract metadata (symbols, date range, frequency).
3. Return a stable DTO consumed by `apps/web`.
4. Add validation and error messages for invalid files.

## When Editing
- Keep file IO async and non-blocking.
- Avoid loading full datasets for metadata only.
