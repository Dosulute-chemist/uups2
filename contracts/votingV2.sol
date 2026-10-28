// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VotingV1} from "./votingV1.sol";

contract VotingV2 is VotingV1 {
    function totalVotes(uint256 id) external view returns (uint256) {
        require(id < proposalCount, "No such proposal");
        return proposals[id].yes + proposals[id].no;
    }
}