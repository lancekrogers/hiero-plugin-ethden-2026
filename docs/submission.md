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
- 38 automated tests, 100% TypeScript strict mode

## Bounty Requirements Mapping

### Hedera Track 4

| Requirement | Implementation |
|-------------|---------------|
| Developer tooling for Hedera ecosystem | Plugin extends Hiero CLI with workspace management |
| Functional implementation | 3 working commands, 5 bundled templates (3 Hedera + 2 0G), 38 tests |
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

## Hiero CLI PR

<!-- ACTION REQUIRED: Lance must create this PR manually -->
<!-- Steps:
  1. gh repo fork hiero-ledger/hiero-cli --clone
  2. cd hiero-cli && git checkout -b feat/camp-plugin
  3. Copy projects/hiero-plugin/dist/ into the plugin directory following PLUGIN_ARCHITECTURE_GUIDE.md
  4. gh pr create using the body below
-->

**PR URL:** <!-- TODO: paste PR URL here after creation -->

### Prepared PR Body

```markdown
## Summary

- Add camp workspace management plugin for Hedera and 0G developer tooling
- Provides `hcli camp init`, `hcli camp status`, and `hcli camp navigate` commands
- Bundles 5 scaffold templates: hedera-smart-contract, hedera-dapp, hedera-agent, 0g-agent, 0g-inft-build

## What This Plugin Does

camp-plugin brings workspace management to the Hiero CLI ecosystem. Developers can:

1. **Initialize projects** from Hedera and 0G templates with `hcli camp init --template <name>`
2. **Monitor workspace status** across multiple projects with `hcli camp status`
3. **Navigate projects** with fuzzy-find via `hcli camp navigate <query>`

## Templates

| Template | Stack | Description |
|----------|-------|-------------|
| hedera-smart-contract | TypeScript/Solidity | Hardhat project with Hedera testnet JSON-RPC |
| hedera-dapp | TypeScript/React | Vite + React with HashConnect wallet integration |
| hedera-agent | Go | Agent with HCS messaging and HTS token operations |
| 0g-agent | Go | 0G Compute inference agent with session auth and DA |
| 0g-inft-build | Solidity/Go | ERC-7857 iNFT minting with encrypted metadata on 0G Chain |

## Test plan

- [x] 38 unit tests passing (`npm test`)
- [x] TypeScript strict mode, zero type errors
- [ ] Manual test: `hcli camp init --name test-app --template hedera-dapp`
- [ ] Manual test: `hcli camp status` in initialized workspace
- [ ] Manual test: `hcli camp navigate test-app`
```

## Demo

<!-- ACTION REQUIRED: Lance must record and upload the demo video -->
<!-- Steps:
  1. Install the plugin: hcli plugin-management add -p $(pwd)/dist
  2. Run: ./demo.sh while screen recording (OBS, QuickTime, or asciinema)
  3. Upload to YouTube (unlisted) or asciinema
  4. Paste link below
-->

**Demo Video:** <!-- TODO: paste video URL here after recording -->

Run `./demo.sh` after installing the plugin, or see `docs/usage-guide.md` for command-by-command examples.
