import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hederaTestnet: {
      url: process.env.HEDERA_TESTNET_RPC_URL || "https://testnet.hashio.io/api",
      chainId: 296,
      accounts: process.env.HEDERA_TESTNET_OPERATOR_KEY
        ? [process.env.HEDERA_TESTNET_OPERATOR_KEY]
        : [],
    },
  },
};

export default config;
