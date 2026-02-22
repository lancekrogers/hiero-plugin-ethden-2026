# ETHDenver 2026 Submission

## Project Name

hiero-plugin-camp

## Tracks

- Hedera Track 4 -- Developer Tooling ($5k)
- 0G Track 4 -- Dev Tooling ($4k)

## Summary

A Hiero CLI plugin that brings camp workspace management to the Hedera and 0G developer ecosystems. Provides project scaffolding with Hedera and 0G templates, workspace status monitoring, and fuzzy-find project navigation -- all accessible through the standard `hcli camp` command namespace.

## What It Does

- **`hcli camp init`** -- Initialize camp workspaces with Hedera and 0G scaffold templates
- **`hcli camp status`** -- Display workspace and project status at a glance
- **`hcli camp navigate`** -- Fuzzy-find navigation for quick project switching
- **5 bundled templates** -- 3 Hedera templates (smart contract, dApp, Go agent) + 2 0G templates (Compute/Storage agent, ERC-7857 iNFT builder)

## How It Works

The plugin registers with the Hiero CLI through the standard plugin manifest API (v0.12.0). Commands invoke the `camp` binary for workspace operations and overlay Hedera-specific configuration. Templates use variable substitution (`{{projectName}}`, etc.) to generate ready-to-use project scaffolds.

## Technical Stack

- TypeScript, Node.js 18+
- Hiero CLI plugin API (Commander.js + Zod)
- Camp binary integration via child_process.execFile
- Hedera SDK (Go v2.44, JS v2.50 in templates)
- go-ethereum v1.13.14 (in 0G Go templates)
- 37 automated tests, 100% TypeScript strict mode

## Bounty Requirements Mapping

### Hedera Track 4

| Requirement | Implementation |
|-------------|---------------|
| Developer tooling for Hedera ecosystem | Plugin extends Hiero CLI with workspace management |
| Functional implementation | 3 working commands, 5 bundled templates (3 Hedera + 2 0G), 37 tests |
| Open source | Apache-2.0, public GitHub repository |
| Documentation | README, usage guide, architecture doc |

### 0G Track 4

| Requirement | Implementation |
|-------------|---------------|
| Developer tooling for 0G ecosystem | 0g-agent and 0g-inft-build templates scaffold 0G projects |
| 0G Compute integration | 0g-agent template includes ComputeBroker stub with endpoint config |
| 0G Storage integration | 0g-agent template includes StorageClient with Upload/Download stubs |
| 0G DA integration | 0g-inft-build template includes DA Publisher stub for blob submission |
| ERC-7857 iNFT support | 0g-inft-build template includes ABI loader, Minter, AES-256-GCM encryption |

## Repository

https://github.com/lancekrogers/hiero-plugin-ethden-2026

## Demo

Run `./demo.sh` after installing the plugin, or see `docs/usage-guide.md` for command-by-command examples.
