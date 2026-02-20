export const HEDERA_CONFIG = {
  network: import.meta.env.VITE_HEDERA_NETWORK || "testnet",
  mirrorNode:
    import.meta.env.VITE_HEDERA_MIRROR_NODE ||
    "https://testnet.mirrornode.hedera.com",
  appMetadata: {
    name: "{{projectName}}",
    description: "{{description}}",
    icons: [],
  },
};
