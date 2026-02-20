# ETHDenver 2026 Submission

## Project Name

hiero-plugin-camp

## Track

Hedera Track 4 -- Developer Tooling ($5k)

## Summary

A Hiero CLI plugin that brings camp workspace management to the Hedera developer ecosystem. Provides project scaffolding with Hedera-specific templates, workspace status monitoring, and fuzzy-find project navigation -- all accessible through the standard `hcli camp` command namespace.

## What It Does

- **`hcli camp init`** -- Initialize camp workspaces with Hedera scaffold templates (smart contract, dApp, Go agent)
- **`hcli camp status`** -- Display workspace and project status at a glance
- **`hcli camp navigate`** -- Fuzzy-find navigation for quick project switching
- **3 bundled templates** -- Pre-configured for Hedera testnet with correct endpoints, SDKs, and project structure

## How It Works

The plugin registers with the Hiero CLI through the standard plugin manifest API (v0.12.0). Commands invoke the `camp` binary for workspace operations and overlay Hedera-specific configuration. Templates use variable substitution (`{{projectName}}`, etc.) to generate ready-to-use project scaffolds.

## Technical Stack

- TypeScript, Node.js 18+
- Hiero CLI plugin API (Commander.js + Zod)
- Camp binary integration via child_process.execFile
- Hedera SDK (Go v2.44, JS v2.50 in templates)
- 37 automated tests, 100% TypeScript strict mode

## Bounty Requirements Mapping

| Requirement | Implementation |
|-------------|---------------|
| Developer tooling for Hedera ecosystem | Plugin extends Hiero CLI with workspace management |
| Functional implementation | 3 working commands, 3 bundled templates, 37 tests |
| Open source | Apache-2.0, public GitHub repository |
| Documentation | README, usage guide, architecture doc |

## Repository

https://github.com/lancekrogers/hiero-plugin-ethden-2026

## Demo

Run `./demo.sh` after installing the plugin, or see `docs/usage-guide.md` for command-by-command examples.
