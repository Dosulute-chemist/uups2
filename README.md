# UUPS Upgradeable Voting Contract

This is my practice project for learning upgradeable smart contracts. I built a simple voting contract using the **UUPS proxy pattern** and then upgraded it from V1 to V2 without losing any data.

I used Hardhat and OpenZeppelin's upgrades plugin.

## What I built

**VotingV1** (`contracts/votingV1.sol`)
- The owner can create proposals.
- Anyone can vote yes or no on a proposal.
- Each address can only vote once per proposal.
- Only the owner can upgrade the contract.

**VotingV2** (`contracts/votingV2.sol`)
- It inherits everything from V1.
- It adds one new function, `totalVotes(id)`, which returns the total number of yes and no votes for a proposal.

## What I learned

- A deployed smart contract can't be edited, so upgradeable contracts split the work into two parts.
- The **proxy** keeps the permanent address and all the data (storage).
- The **implementation** (logic contract) holds the code.
- To upgrade, you deploy a new implementation and point the proxy to it. The proxy address and the data stay the same.
- In **UUPS**, the upgrade function lives in the implementation, so the proxy stays small and cheaper to use.
- If a new version forgets the upgrade function, the contract can never be upgraded again. That is the main risk of UUPS.
- You use `initialize()` instead of a constructor, because the data lives in the proxy.
- Never reorder or delete existing variables in a new version. Only add new ones at the end.

## Project structure

```
contracts/
  votingV1.sol     Version 1 of the voting contract
  votingV2.sol     Version 2 (adds totalVotes)
scripts/
  deploy.js        Deploys V1 behind a UUPS proxy
  upgrade.js       Deploys V1, votes, upgrades to V2, then checks the data
hardhat.config.js  Hardhat config
```

## How to run it

You need Node.js installed.

```bash
npm install
npx hardhat compile
```

Deploy V1 behind a proxy (this uses Hardhat's local network, so it is free):

```bash
npx hardhat run scripts/deploy.js
```

Run the full upgrade test:

```bash
npx hardhat run scripts/upgrade.js
```

## What the output means

When I run `upgrade.js`, I get 7 lines. In the logs, "Desk address" is the proxy and "Worker" is the implementation.

```
Desk address: 0x...                 (the proxy)
Worker V1: 0x...                    (implementation V1)
Yes votes before upgrade: 1
Desk address after upgrade: 0x...   (same proxy address)
Worker V2: 0x...                    (new implementation address)
Yes votes after upgrade: 1          (data is still there)
Total votes (new skill): 1          (new V2 function works)
```

What I check:
- The proxy address is the **same** before and after the upgrade.
- The implementation address is **different**.
- The vote count is still 1 after the upgrade.
- `totalVotes` works, which V1 could not do.

## Problems I ran into

- `npm` was not found at first, so I had to install Node.js using nvm.
- The upgrades plugin v4 needs Hardhat 3, so I installed `@openzeppelin/hardhat-upgrades@3` to match Hardhat 2.
- The newest OpenZeppelin doesn't have `__UUPSUpgradeable_init()` anymore, so I removed that line.
- The plugin complained about the constructor. I fixed it by adding `@custom:oz-upgrades-unsafe-allow constructor`, because the constructor only calls `_disableInitializers()`.
- The deploy script failed until I added the upgrades plugin line to `hardhat.config.js`.

## What's next

- A lending contract using the **Transparent proxy** pattern.
- A **Diamond (EIP-2535)** contract.
- Tests with Hardhat so I don't rely only on scripts.

## Author

Bello David
