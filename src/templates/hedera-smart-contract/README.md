# {{projectName}}

{{description}}

## Prerequisites

- Node.js >= 18
- A Hedera testnet account ([portal.hedera.com](https://portal.hedera.com))

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your Hedera testnet credentials
```

## Compile

```bash
npm run compile
```

## Test

```bash
npm test
```

## Deploy to Hedera Testnet

```bash
npm run deploy:testnet
```
