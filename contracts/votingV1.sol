// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract VotingV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    struct Proposal {
        string description;
        uint256 yes;
        uint256 no;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
/// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    function initialize(address initialOwner) public initializer {
        __Ownable_init(initialOwner);
        
    }

    function createProposal(string calldata description) external onlyOwner {
        proposals[proposalCount] = Proposal(description, 0, 0);
        proposalCount++;
    }

    function vote(uint256 id, bool support) external {
        require(id < proposalCount, "No such proposal");
        require(!hasVoted[id][msg.sender], "Already voted");
        hasVoted[id][msg.sender] = true;
        if (support) proposals[id].yes++;
        else proposals[id].no++;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}