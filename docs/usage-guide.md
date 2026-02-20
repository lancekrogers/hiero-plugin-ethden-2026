# Usage Guide

## hcli camp init

Initialize a new camp workspace with optional Hedera scaffold templates.

### Basic Usage

```bash
hcli camp init --name my-project
```

### With Template

```bash
hcli camp init --name my-project --template hedera-dapp
```

### Available Templates

- **hedera-smart-contract** -- Solidity + Hardhat with Hedera testnet JSON-RPC relay (chain ID 296)
- **hedera-dapp** -- React + Vite + HashConnect for building Hedera dApps
- **hedera-agent** -- Go agent with HCS topic messaging and HTS token queries

### Post-Init Steps

```bash
cd my-project
# For JS/TS templates:
npm install
cp .env.example .env
# Edit .env with your Hedera testnet credentials from portal.hedera.com
```

---

## hcli camp status

Display workspace status including project listing.

### Basic Usage

```bash
hcli camp status
```

### Verbose Mode

```bash
hcli camp status --verbose
```

Includes raw camp output alongside the formatted display.

### Troubleshooting

- **"No camp workspace found"** -- Run `hcli camp init` first or navigate to a workspace directory.
- **"Failed to get workspace status"** -- Ensure the `camp` binary is on your PATH.

---

## hcli camp navigate

Fuzzy-find navigation within the workspace. Tries native `camp navigate` first, falls back to a built-in fuzzy matcher against the project list.

### Basic Usage

```bash
hcli camp navigate
```

### With Search Query

```bash
hcli camp navigate my-app
```

Returns the best-matching project. If exactly one match, outputs the path directly (pipe-friendly).

### Shell Integration

```bash
cd $(hcli camp navigate my-app)
```

### Troubleshooting

- **"No projects found"** -- Initialize a workspace with `hcli camp init` first.
- **"No projects matching"** -- Try a broader query or run without arguments to see all projects.

---

## Common Workflows

### New Hedera Smart Contract Project

```bash
hcli camp init --name my-contracts --template hedera-smart-contract
cd my-contracts
npm install
cp .env.example .env
# Add your Hedera testnet operator credentials to .env
npm run compile
npm test
npm run deploy:testnet
```

### New Hedera dApp

```bash
hcli camp init --name my-dapp --template hedera-dapp
cd my-dapp
npm install
npm run dev
# Open http://localhost:5173, click "Connect HashPack"
```

### New Hedera Go Agent

```bash
hcli camp init --name my-agent --template hedera-agent
cd my-agent
cp .env.example .env
# Add your Hedera testnet credentials to .env
go mod tidy
just run
```
