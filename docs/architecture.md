# Architecture

## Overview

```
Hiero CLI (hcli)
  └── PluginManager
        └── camp plugin (manifest.ts)
              ├── init handler  ──→ execCamp(['init', ...]) ──→ camp binary
              ├── status handler ──→ execCamp(['status', ...])
              └── navigate handler ──→ execCamp(['navigate', ...])
                                       ↓ (fallback)
                                   fuzzy matcher on project list
```

The plugin follows the Hiero CLI plugin architecture (v0.12.0). It registers commands under the `camp` namespace and delegates execution to the `camp` binary via `child_process.execFile`.

## Plugin Registration

**Manifest** (`src/manifest.ts`): Exports a `PluginManifest` object with:
- `name: 'camp'` -- becomes the command group (`hcli camp <subcommand>`)
- `commands[]` -- each defines name, summary, description, options, handler, and output spec

**Handler contract**: Each handler receives `CommandHandlerArgs` (args, api, state, config, logger) and returns `CommandExecutionResult` with status and JSON output.

**Discovery**: The Hiero CLI loads plugins via `hcli plugin-management add -p <path>`. It reads `manifest.js` from the plugin directory root.

## Camp Binary Integration

**Why wrap camp**: The plugin extends an existing workspace management tool rather than reimplementing it. This keeps the plugin thin and focused on Hedera-specific enhancements.

**Binary discovery** (`src/camp.ts`):
1. `findCampBinary()` -- runs `which camp` (or `where` on Windows), checks `existsSync`
2. `execCamp(args, options)` -- spawns the binary with `child_process.execFile` (no shell, prevents injection)
3. Timeout: 30s default, returns exit code 124 on timeout
4. Buffer: 10MB max for large outputs
5. `CampNotFoundError` -- thrown with installation instructions when camp is missing

**execFile over exec**: `execFile` does not invoke a shell, eliminating shell injection risk from arguments.

## Command Design

All three handlers follow the same pattern:
1. Parse args from `CommandHandlerArgs.args` (pre-parsed by Commander.js via the manifest options)
2. Validate inputs, return `{ status: 'failure', errorMessage }` on bad input
3. Call `execCamp(...)` with the appropriate subcommand and flags
4. Transform camp output into structured JSON for the Hiero CLI output pipeline
5. Return `{ status: 'success', outputJson }` or `{ status: 'failure', errorMessage }`

## Template System

**Storage**: Templates live in `src/templates/<template-id>/` as static files with `{{variable}}` placeholders. They are not compiled by TypeScript (excluded in tsconfig).

**Registry** (`src/registry.ts`):
- `listTemplates()` / `getTemplate(id)` -- metadata lookup
- `buildVariables(projectName)` -- creates substitution variables (projectName, projectNamePascal, description, author, year)
- `renderTemplate(content, vars)` -- regex-based `{{var}}` replacement
- `copyTemplate(templateId, targetDir, vars)` -- recursive file copy with content and filename substitution, skips `template.json`

**Template metadata** (`template.json` in each template): id, name, description, language, tags. Not copied to generated projects.

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| TypeScript | Aligns with Hiero CLI ecosystem (TypeScript + Commander.js + Zod) |
| No external runtime deps | Plugin only uses Node.js built-ins (child_process, fs, path) |
| execFile not exec | Prevents shell injection when passing user arguments to camp |
| Fuzzy fallback in navigate | camp may not support navigate natively; built-in fallback provides consistent UX |
| Templates as static files | Simple, no build step needed; variable substitution is straightforward regex |
| tsconfig excludes templates | Template files contain JSX, Go, Solidity -- not valid plugin TypeScript |

## Bundled Templates

### Hedera Templates

| Template ID | Language | Description |
|-------------|----------|-------------|
| `hedera-smart-contract` | TypeScript/Solidity | Hardhat project pre-configured for Hedera testnet |
| `hedera-dapp` | TypeScript/React | React + Vite dApp with HashConnect wallet |
| `hedera-agent` | Go | Agent with HCS topic messaging and HTS token queries |

### 0G Templates

| Template ID | Language | Description |
|-------------|----------|-------------|
| `0g-agent` | Go | Agent with 0G Compute broker, Storage client, and EVM chain integration |
| `0g-inft-build` | Go | ERC-7857 iNFT minter with AES-256-GCM encryption and 0G DA storage |

**0g-agent structure**: `cmd/agent/main.go` wires config, chain client (`go-ethereum`), ComputeBroker, and StorageClient into a poll loop. Internal packages: `config/`, `zerog/` (chain.go, compute.go, storage.go).

**0g-inft-build structure**: `cmd/mint/main.go` orchestrates encrypt-model -> publish-to-DA -> mint-iNFT flow. Internal packages: `config/`, `crypto/` (AES-256-GCM), `da/` (publisher), `inft/` (ABI loader, minter via `bind.BoundContract`).
