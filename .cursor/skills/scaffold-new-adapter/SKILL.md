---
name: scaffold-new-adapter
description: Scaffolds a new exchange adapter with interface stubs, config, and registration. Use when adding a new venue adapter.
---
# Scaffold New Adapter

## Instructions
1. Locate the adapter interface and existing adapters (in apps/trader).
2. Create a new adapter module that implements the interface methods.
3. Add adapter-specific config types and defaults.
4. Register the adapter in the adapter registry.
5. Add minimal tests or a health check if applicable.

## Checklist
- [ ] Adapter module created
- [ ] Config types/defaults added
- [ ] Adapter registered
- [ ] Basic validation or health check added

## Example triggers
- "Add a new exchange adapter"
- "Scaffold a venue adapter"
