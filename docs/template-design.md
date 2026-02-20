# Template Design Document

## Overview

Three Hedera scaffold templates bundle with the plugin to let developers quickly bootstrap projects targeting the Hedera network. Each template targets a common use case and includes Hedera testnet configuration out of the box.

## Variable Substitution

Templates use Handlebars-style `{{variable}}` placeholders replaced at init time.

| Variable | Description | Example |
|----------|-------------|---------|
| `{{projectName}}` | Project name (kebab-case) | `my-hedera-app` |
| `{{projectNamePascal}}` | PascalCase | `MyHederaApp` |
| `{{description}}` | Project description | `A Hedera smart contract project` |
| `{{author}}` | Author name | `Developer` |
| `{{year}}` | Current year | `2026` |

## Template Metadata Schema

```typescript
interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  language: string;
  tags: string[];
}
```

---

## Template 1: hedera-smart-contract

**Audience**: Solidity developers deploying contracts to Hedera via JSON-RPC relay.

**Metadata**:
- id: `hedera-smart-contract`
- name: `Hedera Smart Contract`
- description: `Solidity + Hardhat project pre-configured for Hedera testnet`
- language: `TypeScript/Solidity`
- tags: `solidity`, `hardhat`, `smart-contract`, `evm`

**File Structure**:
```
{{projectName}}/
  package.json
  hardhat.config.ts
  tsconfig.json
  .env.example
  .gitignore
  README.md
  contracts/
    HelloHedera.sol
  scripts/
    deploy.ts
  test/
    HelloHedera.test.ts
```

**Dependencies**: hardhat, @nomicfoundation/hardhat-toolbox, dotenv

**Configuration**: Hedera testnet JSON-RPC relay at `https://testnet.hashio.io/api`, chain ID 296.

---

## Template 2: hedera-dapp

**Audience**: Frontend developers building dApps with Hedera wallet integration.

**Metadata**:
- id: `hedera-dapp`
- name: `Hedera dApp`
- description: `React + Vite dApp with HashConnect wallet integration`
- language: `TypeScript/React`
- tags: `react`, `vite`, `hashconnect`, `dapp`, `frontend`

**File Structure**:
```
{{projectName}}/
  package.json
  tsconfig.json
  vite.config.ts
  index.html
  .env.example
  .gitignore
  README.md
  src/
    main.tsx
    App.tsx
    App.css
    components/
      WalletConnect.tsx
      AccountInfo.tsx
    hooks/
      useHashConnect.ts
    config/
      hedera.ts
  public/
    vite.svg
```

**Dependencies**: react, react-dom, hashconnect, @hashgraph/sdk, vite

**Configuration**: Hedera testnet mirror node at `https://testnet.mirrornode.hedera.com`, app metadata for HashConnect pairing.

---

## Template 3: hedera-agent

**Audience**: Go developers building agents with HCS messaging and HTS token operations.

**Metadata**:
- id: `hedera-agent`
- name: `Hedera Agent`
- description: `Go agent with HCS and HTS integration via Hedera SDK`
- language: `Go`
- tags: `go`, `agent`, `hcs`, `hts`, `consensus`, `token`

**File Structure**:
```
{{projectName}}/
  go.mod
  go.sum
  justfile
  .env.example
  .gitignore
  README.md
  cmd/
    agent/
      main.go
  internal/
    agent/
      agent.go
    hcs/
      client.go
      topic.go
    hts/
      client.go
      token.go
    config/
      config.go
```

**Dependencies**: github.com/hashgraph/hedera-sdk-go/v2, github.com/joho/godotenv

**Configuration**: Hedera testnet network, operator account ID and private key from env.

---

## Integration Plan

1. Templates stored in `src/templates/<template-id>/` as static files with `{{variable}}` placeholders
2. `TemplateRegistry` in `src/templates/registry.ts` lists metadata for all templates
3. Init handler queries the registry to validate `--template` flag and render files
4. Rendering: read template files, replace variables, write to target directory
