# Hiero CLI Plugin API Research

## Overview

The Hiero CLI (`@hiero-ledger/hiero-cli` v0.12.0) has a functional plugin system built on TypeScript, Commander.js, and Zod. Plugins are discovered via filesystem path and loaded from a `manifest.js` file. The CLI binary is `hcli`.

**Repository**: [hiero-ledger/hiero-cli](https://github.com/hiero-ledger/hiero-cli)

## Plugin Discovery

Two discovery paths:

1. **Bundled plugins**: Loaded from `dist/plugins/{name}/` relative to the PluginManager
2. **External plugins**: Added via `hcli plugin-management add -p /path/to/plugin`

There is **no npm-based auto-discovery** yet. Plugins must be manually added via filesystem path. Issue #1379 tracks community plugin instructions.

### Bootstrap Sequence (hiero-cli.ts)

1. Create `CoreApi` dependency container
2. Pre-parse global args (format, network, payer)
3. Validate global options with Zod
4. Initialize `PluginManager`
5. `PluginManager.initializePlugins()` seeds state, registers disabled stubs, loads enabled plugins
6. `PluginManager.registerCommands()` registers commands in Commander.js
7. Parse and execute the resolved command

## Manifest Format

File: `manifest.ts` (compiled to `manifest.js`) at the plugin directory root.

```typescript
import type { PluginManifest, CommandSpec } from '@hiero-ledger/hiero-cli';

export const campManifest: PluginManifest = {
  name: 'camp',              // Unique ID, becomes command group name
  version: '1.0.0',          // Semver version
  displayName: 'Camp Plugin', // Human-readable name
  description: 'Hedera developer workspace management',
  commands: [/* CommandSpec[] */]
};

export default campManifest;
```

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `name` | `string` | Yes | Unique plugin ID, becomes the command group |
| `version` | `string` | Yes | Semver version |
| `displayName` | `string` | Yes | Human-readable name |
| `description` | `string` | Yes | Description for help |
| `commands` | `CommandSpec[]` | Yes | Array of command definitions |

## Command Registration

Commands follow `hcli <plugin-name> <command-name> [options]`. For our plugin: `hcli camp init`, `hcli camp status`, `hcli camp navigate`.

### CommandSpec

```typescript
{
  name: 'init',
  summary: 'Initialize a new camp workspace',
  description: 'Creates a new Hedera developer workspace',
  options: [
    {
      name: 'name',
      short: 'n',
      type: 'string',   // string|number|boolean|array|repeatable
      required: true,
      description: 'Workspace name'
    }
  ],
  handler: initHandler,
  output: {
    schema: InitOutputSchema,           // Zod schema
    humanTemplate: INIT_HUMAN_TEMPLATE  // Handlebars template
  },
  excessArguments: false,
  requireConfirmation: 'Initialize workspace {{name}}?'  // Optional
}
```

## Command Handler Contract

```typescript
export async function handler(
  args: CommandHandlerArgs
): Promise<CommandExecutionResult> {
  // args.args   - Record<string, unknown> (parsed CLI arguments)
  // args.api    - CoreApi (service container)
  // args.state  - StateService (namespaced persistence)
  // args.config - ConfigService
  // args.logger - Logger (stderr)

  const validated = InputSchema.parse(args.args);

  try {
    const result = await doWork(validated, args.api);
    return {
      status: 'success',
      outputJson: JSON.stringify(result)
    };
  } catch (error) {
    return {
      status: 'failure',
      errorMessage: `Operation failed: ${String(error)}`
    };
  }
}
```

## Available CoreApi Services

| Service | Purpose |
|---------|---------|
| `api.account` | Hedera account management |
| `api.token` | Token operations |
| `api.topic` | Consensus topic operations |
| `api.txExecution` | Sign and execute transactions |
| `api.state` | Namespaced get/set/delete/list persistence |
| `api.mirror` | Mirror node queries |
| `api.network` | Network switching and operator config |
| `api.config` | CLI configuration read/write |
| `api.logger` | Structured logging to stderr |
| `api.kms` | Key management |
| `api.hbar` | HBAR transfer operations |
| `api.output` | Output formatting pipeline |
| `api.pluginManagement` | Plugin add/remove/enable/disable |

## State Management

Plugins can persist data via namespaced state:

```typescript
const CAMP_NAMESPACE = 'camp-workspaces';

// In handler:
await args.state.set(CAMP_NAMESPACE, key, value);
const data = await args.state.get(CAMP_NAMESPACE, key);
```

State lives at `~/.hiero-cli/state/` in namespaced JSON files.

## Lifecycle Hooks

**No explicit lifecycle hooks** exist (onLoad, onUnload, beforeCommand, afterCommand). The lifecycle is implicit: discovery -> validation -> state init -> command registration -> execution.

## Reference Plugins

- **`src/plugins/hbar/`** -- Simplest (1 command: `transfer`)
- **`src/plugins/test/`** -- Minimal reference (2 commands: `foo`, `memo`)
- **`src/plugins/account/`** -- Full-featured (7 commands)
- **`src/plugins/plugin-management/`** -- Meta-plugin (6 commands)

## Plugin Directory Structure

```
hiero-plugin-camp/
  manifest.ts              # Required: plugin manifest
  commands/
    init/
      handler.ts           # Business logic
      input.ts             # Zod input validation
      output.ts            # Output schema + template
      index.ts
    status/
      handler.ts, input.ts, output.ts, index.ts
    navigate/
      handler.ts, input.ts, output.ts, index.ts
  schema.ts                # State schema
  types.ts                 # Type definitions
  __tests__/unit/
  package.json
  tsconfig.json
```

## Implementation Plan

1. Use the native plugin system (production-ready)
2. Register under `camp` namespace -> `hcli camp init|status|navigate`
3. Write in TypeScript with standard plugin directory structure
4. Wrap the `camp` binary using `child_process.execFile()` in handlers
5. Distribute via filesystem path initially (`hcli plugin-management add -p ./dist`)
6. Use `test` and `hbar` plugins as reference implementations

## Open Questions and Risks

| Risk | Level | Notes |
|------|-------|-------|
| Plugin system maturity | Medium | External plugin story still maturing (issue #1379) |
| Distribution | Low-Medium | Filesystem path only, no npm install yet |
| API stability | Medium | Pre-1.0 (v0.12.0), handler contract could evolve |
| Camp binary wrapping | Low | `child_process.execFile()` is straightforward |

**Key correction**: The existing `package.json` has `"hiero": { "type": "plugin" }` -- this is NOT how the CLI discovers plugins. The CLI loads `manifest.js` from the plugin root. The package.json metadata is irrelevant to the plugin loader.
