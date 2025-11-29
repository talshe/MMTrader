# Spread Backtest Configuration

This document describes the JSON configuration format for running parameter sweep backtests on spread trading strategies.

## Overview

The backtest configuration supports two types of parameters:
- **Variable Parameters**: Parameters that will be swept across a range of values, generating permutations
- **Constant Parameters**: Parameters that remain fixed across all permutations

## Variable Parameters

These parameters define ranges with `min`, `max`, and `step` values. The backtest engine will generate all permutations of these variable parameters and run a separate backtest for each combination.

### Standard Deviation Multiplier
- **Name**: `stdDevMultiplier`
- **Description**: Multiplier applied to the standard deviation to determine upper and lower entry boundaries for spread trades
- **Type**: Number (positive)
- **Range**: Defined by `min`, `max`, `step` in the configuration

### Sliding Window Length
- **Name**: `windowLength`
- **Description**: Number of periods used to calculate the rolling mean and standard deviation of the spread
- **Type**: Integer (positive)
- **Range**: Defined by `min`, `max`, `step` in the configuration

## Constant Parameters

These parameters remain the same for all permutations in a backtest run.

### Timezone
- **Name**: `timezone`
- **Description**: IANA timezone identifier (e.g., "America/New_York", "UTC")
- **Type**: String
- **Format**: IANA timezone name

### Start Date
- **Name**: `startDate`
- **Description**: Beginning of the backtest period
- **Type**: String
- **Format**: ISO-8601 date string (YYYY-MM-DD)

### End Date
- **Name**: `endDate`
- **Description**: End of the backtest period
- **Type**: String
- **Format**: ISO-8601 date string (YYYY-MM-DD)

### Assets
- **Name**: `assets`
- **Description**: Object containing the two assets and their weights for the spread calculation
- **Type**: Object
- **Structure**:
  - `assetA`: Object with `path` (relative file path) and `weight` (number)
  - `assetB`: Object with `path` (relative file path) and `weight` (number)
- **Note**: Asset paths are relative to the `data/` directory. The spread is calculated as: `assetA.price * assetA.weight + assetB.price * assetB.weight`

## Permutation Generation

When a backtest configuration is loaded, the system generates all permutations of the variable parameters. For example:
- If `stdDevMultiplier` has values [1.0, 2.0, 3.0]
- And `windowLength` has values [20, 40, 60]

Then 3 × 3 = 9 backtests will be executed, each with the same constant parameters but different combinations of variable parameters.

## Validation Rules

- All variable parameter steps must be positive
- Window length must be a positive integer
- Start date must be before end date
- Asset paths must reference valid files in the `data/` directory
- Timezone must be a valid IANA timezone identifier

