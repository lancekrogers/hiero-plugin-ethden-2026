import { ethers } from "hardhat";

async function main() {
  const greeting = "Hello from Hedera!";
  const HelloHedera = await ethers.getContractFactory("HelloHedera");
  const contract = await HelloHedera.deploy(greeting);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`HelloHedera deployed to: ${address}`);
  console.log(`Initial greeting: ${greeting}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
