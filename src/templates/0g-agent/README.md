# {{projectName}}

{{description}}

## Prerequisites

- Go 1.22+
- A 0G testnet account ([docs.0g.ai](https://docs.0g.ai))

## Setup

```bash
cp .env.example .env
# Edit .env with your 0G testnet credentials
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
