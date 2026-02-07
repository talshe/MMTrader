---
name: add-execution-model-params
description: Adds execution model parameters to configs and wires them into backtest or live execution. Use when adding slippage, fees, or fill-model parameters.
---
# Add Execution Model Params

## Instructions
1. Locate the execution model config schema and defaults.
2. Add the new parameter(s) with clear validation and documentation.
3. Wire the parameter(s) into the execution model logic.
4. Update any sample configs or schema files.

## Checklist
- [ ] Config schema updated
- [ ] Defaults updated
- [ ] Execution logic uses new params
- [ ] Sample config updated

## Example triggers
- "Add a slippage parameter"
- "Add fee model fields"
