---
name: scaffold-new-strategy
description: Scaffolds a new trading strategy module with config, registration, and tests. Use when creating a new strategy or adding a strategy template.
---
# Scaffold New Strategy

## Instructions
1. Find the existing strategy pattern (e.g., spread strategy) and the base strategy interface/class.
2. Create a new strategy module following the same folder and naming conventions.
3. Add a default config and any schema/validation used by the strategy registry.
4. Register the strategy in the strategy registry or factory.
5. Add minimal tests or a smoke backtest config if the repo uses them.

## Checklist
- [ ] Strategy module created
- [ ] Config + schema added
- [ ] Strategy registered
- [ ] Basic test or example config added

## Example triggers
- "Add a new strategy"
- "Scaffold a strategy template"
