import { expect } from "chai";
import { ethers } from "hardhat";

describe("HelloHedera", function () {
  it("should return the initial greeting", async function () {
    const HelloHedera = await ethers.getContractFactory("HelloHedera");
    const contract = await HelloHedera.deploy("Hello from Hedera!");
    expect(await contract.greeting()).to.equal("Hello from Hedera!");
  });

  it("should update the greeting", async function () {
    const HelloHedera = await ethers.getContractFactory("HelloHedera");
    const contract = await HelloHedera.deploy("Hello");
    await contract.setGreeting("Updated greeting");
    expect(await contract.greeting()).to.equal("Updated greeting");
  });
});
