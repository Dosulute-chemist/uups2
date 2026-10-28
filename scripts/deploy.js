const { ethers, upgrades } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();

  const VotingV1 = await ethers.getContractFactory("VotingV1");

  const proxy = await upgrades.deployProxy(VotingV1, [owner.address], {
    kind: "uups",
  });
  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();
  const logicAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

  console.log("Proxy (the desk):", proxyAddress);
  console.log("Logic (the worker):", logicAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});