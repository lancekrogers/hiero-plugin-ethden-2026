# hiero-plugin-camp

Hiero CLI plugin for camp workspace management -- Hedera developer tooling.

## Overview

hiero-plugin-camp extends the [Hiero CLI](https://github.com/hiero-ledger/hiero-cli) with workspace management commands under the `hcli camp` namespace. It wraps the `camp` binary to provide Hedera-specific project initialization, status reporting, and workspace navigation, bundling three scaffold templates for common Hedera development patterns.

Built for **Hedera Track 4** at ETHDenver 2026.

## Quick Start

```bash
# Register the plugin with Hiero CLI
hcli plugin-management add -p /path/to/hiero-plugin-camp/dist

# Initialize a Hedera dApp project
hcli camp init --name my-hedera-app --template hedera-dapp

# Check workspace status
hcli camp status

# Navigate projects
hcli camp navigate my-app
```

## Prerequisites

- Node.js >= 18
- [Hiero CLI](https://github.com/hiero-ledger/hiero-cli) installed (`npm install -g @hiero-ledger/hiero-cli`)
- `camp` binary installed and on PATH
- Hedera testnet account for template projects ([portal.hedera.com](https://portal.hedera.com))

## Installation

```bash
git clone https://github.com/lancekrogers/hiero-plugin-ethden-2026.git
cd hiero-plugin-ethden-2026
npm install
npm run build

# Register with Hiero CLI
hcli plugin-management add -p $(pwd)/dist
```

## Commands

| Command | Description |
|---------|-------------|
| `hcli camp init` | Initialize a camp workspace with Hedera templates |
| `hcli camp status` | Show project status across the workspace |
| `hcli camp navigate` | Fuzzy-find navigation within the workspace |

See [docs/usage-guide.md](docs/usage-guide.md) for detailed usage examples.

## Templates

| Template | Language | Description |
|----------|----------|-------------|
| `hedera-smart-contract` | TypeScript/Solidity | Hardhat project with Hedera testnet JSON-RPC config |
| `hedera-dapp` | TypeScript/React | Vite + React app with HashConnect wallet integration |
| `hedera-agent` | Go | Agent with HCS messaging and HTS token operations |

## Development

```bash
just install    # Install dependencies
just build      # Compile TypeScript
just test       # Run tests (37 tests)
just lint       # Type-check without emitting
just dev        # Watch mode
```

## Architecture

See [docs/architecture.md](docs/architecture.md) for design decisions and component overview.

## License

Apache-2.0
