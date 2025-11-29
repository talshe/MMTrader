/**
 * Configuration loader and permutation generator for spread backtest parameter sweeps.
 *
 * This module handles loading JSON configuration files and generating all permutations
 * of variable parameters for backtest execution.
 */

export interface VariableParameter {
  name: 'stdDevMultiplier' | 'windowLength';
  min: number;
  max: number;
  step: number;
}

export interface AssetDefinition {
  path: string;
  weight: number;
}

export interface ConstantParameters {
  timezone: string;
  startDate: string;
  endDate: string;
  assets: {
    assetA: AssetDefinition;
    assetB: AssetDefinition;
  };
}

export interface SpreadBacktestConfig {
  variables: VariableParameter[];
  constants: ConstantParameters;
}

export interface ParameterPermutation {
  stdDevMultiplier: number;
  windowLength: number;
}

export interface BacktestPermutation {
  constants: ConstantParameters;
  parameters: ParameterPermutation;
}

/**
 * Generates all values for a single variable parameter based on min, max, and step.
 *
 * @param param - Variable parameter definition
 * @returns Array of values to test for this parameter
 */
function generateParameterValues(param: VariableParameter): number[] {
  const values: number[] = [];
  let current = param.min;

  while (current <= param.max) {
    values.push(current);
    current += param.step;
  }

  // Ensure max is included if step doesn't land exactly on it
  if (values[values.length - 1] < param.max) {
    values.push(param.max);
  }

  return values;
}

/**
 * Generates the cartesian product of multiple arrays.
 *
 * @param arrays - Array of arrays to combine
 * @returns Array of all combinations
 */
function cartesianProduct<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return [[]];
  if (arrays.length === 1) return arrays[0].map((item) => [item]);

  const [first, ...rest] = arrays;
  const restProduct = cartesianProduct(rest);

  return first.flatMap((item) => restProduct.map((combo) => [item, ...combo]));
}

/**
 * Generates all permutations of variable parameters combined with constant parameters.
 *
 * This function:
 * 1. Generates all possible values for each variable parameter
 * 2. Creates the cartesian product of all variable parameter combinations
 * 3. Combines each permutation with the constant parameters
 *
 * Example:
 * - stdDevMultiplier: [1.5, 2.0, 2.5]
 * - windowLength: [20, 40, 60]
 * Results in 3 × 3 = 9 backtest permutations
 *
 * @param config - The loaded backtest configuration
 * @returns Array of backtest permutations, each with constants and specific parameter values
 */
export function generateBacktestPermutations(
  config: SpreadBacktestConfig
): BacktestPermutation[] {
  // Generate values for each variable parameter
  const parameterValues: Record<string, number[]> = {};
  const parameterOrder: string[] = [];

  for (const variable of config.variables) {
    const values = generateParameterValues(variable);
    parameterValues[variable.name] = values;
    parameterOrder.push(variable.name);
  }

  // Create cartesian product of all parameter combinations
  const valueArrays = parameterOrder.map((name) => parameterValues[name]);
  const combinations = cartesianProduct(valueArrays);

  // Map each combination to a BacktestPermutation
  return combinations.map((combo) => {
    const parameters: Partial<ParameterPermutation> = {};

    parameterOrder.forEach((name, index) => {
      parameters[name as keyof ParameterPermutation] = combo[index];
    });

    return {
      constants: config.constants,
      parameters: parameters as ParameterPermutation,
    };
  });
}

/**
 * Loads and validates a spread backtest configuration from a JSON file.
 *
 * @param configPath - Path to the JSON configuration file
 * @returns Parsed configuration object
 * @throws Error if file cannot be read or parsed
 */
export async function loadBacktestConfig(
  configPath: string
): Promise<SpreadBacktestConfig> {
  // In a real implementation, this would read from the filesystem
  // For now, this is a placeholder that shows the expected interface
  const response = await fetch(configPath);
  if (!response.ok) {
    throw new Error(`Failed to load config from ${configPath}: ${response.statusText}`);
  }

  const config = await response.json();

  // Basic validation
  if (!config.variables || !Array.isArray(config.variables)) {
    throw new Error('Config must have a variables array');
  }

  if (!config.constants) {
    throw new Error('Config must have constants object');
  }

  // Validate required constant fields
  const requiredConstants = ['timezone', 'startDate', 'endDate', 'assets'];
  for (const field of requiredConstants) {
    if (!config.constants[field]) {
      throw new Error(`Config constants must have ${field}`);
    }
  }

  // Validate assets structure
  if (!config.constants.assets.assetA || !config.constants.assets.assetB) {
    throw new Error('Config must have both assetA and assetB defined');
  }

  return config as SpreadBacktestConfig;
}

/**
 * Converts a backtest permutation to a BacktestRequest format.
 *
 * This helper function bridges the configuration format to the existing
 * BacktestRequest interface used by the backtest execution system.
 *
 * @param permutation - A single backtest permutation
 * @param id - Unique identifier for this backtest run
 * @param resolution - Data resolution for the backtest
 * @returns BacktestRequest ready for execution
 */
export function permutationToBacktestRequest(
  permutation: BacktestPermutation,
  id: string,
  resolution: '1s' | '1m' | '5m' = '1m'
): {
  id: string;
  datasetName: string;
  legs: [{ symbol: string; multiplier: number }, { symbol: string; multiplier: number }];
  startDate: string;
  endDate: string;
  resolution: '1s' | '1m' | '5m';
  parameters: Record<string, number | string>;
} {
  return {
    id,
    datasetName: permutation.constants.assets.assetA.path, // Primary dataset
    legs: [
      {
        symbol: permutation.constants.assets.assetA.path,
        multiplier: permutation.constants.assets.assetA.weight,
      },
      {
        symbol: permutation.constants.assets.assetB.path,
        multiplier: permutation.constants.assets.assetB.weight,
      },
    ],
    startDate: permutation.constants.startDate,
    endDate: permutation.constants.endDate,
    resolution,
    parameters: {
      stdDevMultiplier: permutation.parameters.stdDevMultiplier,
      windowLength: permutation.parameters.windowLength,
      timezone: permutation.constants.timezone,
    },
  };
}

