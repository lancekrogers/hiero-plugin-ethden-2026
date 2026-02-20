/**
 * Type definitions for Hiero CLI plugin system.
 * Based on hiero-cli v0.12.0 plugin architecture.
 * These mirror the types from src/core/plugins/plugin.types.ts in hiero-cli.
 */

export interface PluginManifest {
  name: string;
  version: string;
  displayName: string;
  description: string;
  commands: CommandSpec[];
}

export interface CommandSpec {
  name: string;
  summary: string;
  description: string;
  options?: CommandOption[];
  handler: (args: CommandHandlerArgs) => Promise<CommandExecutionResult>;
  output: CommandOutputSpec;
  excessArguments?: boolean;
  requireConfirmation?: string;
}

export interface CommandOption {
  name: string;
  short?: string;
  type: OptionType;
  required?: boolean;
  description: string;
  default?: unknown;
}

export type OptionType = 'string' | 'number' | 'boolean' | 'array' | 'repeatable';

export interface CommandHandlerArgs {
  args: Record<string, unknown>;
  api: CoreApi;
  state: StateService;
  config: ConfigService;
  logger: Logger;
}

export interface CommandExecutionResult {
  status: 'success' | 'failure';
  outputJson?: string;
  errorMessage?: string;
}

export interface CommandOutputSpec {
  schema: unknown;
  humanTemplate?: string;
}

// Minimal CoreApi interface for the services we use
export interface CoreApi {
  state: StateService;
  config: ConfigService;
  logger: Logger;
  [key: string]: unknown;
}

export interface StateService {
  get(namespace: string, key: string): Promise<unknown>;
  set(namespace: string, key: string, value: unknown): Promise<void>;
  delete(namespace: string, key: string): Promise<void>;
  has(namespace: string, key: string): Promise<boolean>;
  list(namespace: string): Promise<string[]>;
  getKeys(namespace: string): Promise<string[]>;
}

export interface ConfigService {
  get(key: string): unknown;
  set(key: string, value: unknown): void;
}

export interface Logger {
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
}
