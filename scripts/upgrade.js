const { ethers, upgrades } = require("hardhat");

async function main() {
  const [owner, voter] = await ethers.getSigners();

  // 1. Build the desk with worker V1
  const V1 = await ethers.getContractFactory("VotingV1");
  const proxy = await upgrades.deployProxy(V1, [owner.address], { kind: "uups" });
  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log("Desk address:", proxyAddress);
  console.log("Worker V1:", await upgrades.erc1967.getImplementationAddress(proxyAddress));

  // 2. Make a proposal and cast one vote
  await proxy.createProposal("Build a new school");
  await proxy.connect(voter).vote(0, true);
  console.log("Yes votes before upgrade:", (await proxy.proposals(0)).yes.toString());

  // 3. Swap the worker to V2
  const V2 = await ethers.getContractFactory("VotingV2");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, V2);
  console.log("Desk address after upgrade:", await upgraded.getAddress());
  console.log("Worker V2:", await upgrades.erc1967.getImplementationAddress(proxyAddress));

  // 4. Check the old data is safe and the new skill works
  console.log("Yes votes after upgrade:", (await upgraded.proposals(0)).yes.toString());
  console.log("Total votes (new skill):", (await upgraded.totalVotes(0)).toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});