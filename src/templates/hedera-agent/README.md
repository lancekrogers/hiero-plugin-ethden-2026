# {{projectName}}

{{description}}

## Prerequisites

- Go 1.22+
- A Hedera testnet account ([portal.hedera.com](https://portal.hedera.com))

## Setup

```bash
cp .env.example .env
# Edit .env with your Hedera testnet credentials
go mod tidy
```

## Build & Run

```bash
just build
just run
```

## Test

```bash
just test
```
