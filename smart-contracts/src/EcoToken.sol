// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EcoToken is ERC20, Ownable(msg.sender) {
    constructor() ERC20("EcoToken", "ECO") {
        _mint(msg.sender, 1000 * 1e18); // Minting initial supply to the deployer
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
