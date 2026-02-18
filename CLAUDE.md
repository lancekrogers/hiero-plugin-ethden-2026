# hiero-plugin

Hiero CLI plugin — Node.js wrapper around camp for Hedera developer workspaces.
Registers commands under `hiero camp` namespace. Follows PLUGIN_ARCHITECTURE_GUIDE.md.

## Build

```bash
just install  # Install dependencies
just dev      # Run plugin
just test     # Run tests
```

## Structure

- `src/index.js` — Plugin manifest and entry point
- `src/commands/` — Plugin commands (init, status, navigate)
- `src/templates/` — Hedera project templates bundled with plugin
