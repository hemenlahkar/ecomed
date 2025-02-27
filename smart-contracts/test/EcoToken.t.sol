// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/EcoToken.sol";

contract EcoTokenTest is Test {
    EcoToken public ecoToken;
    address public user = address(0x123);

    function setUp() public {
        ecoToken = new EcoToken();
    }

    function testInitialSupply() public {
        assertEq(ecoToken.totalSupply(), 1000 * 1e18);
    }

    function testMint() public {
        ecoToken.mint(user, 50 * 1e18);
        assertEq(ecoToken.balanceOf(user), 50 * 1e18);
    }

    function testFailMintNotOwner() public {
        vm.prank(user); // Make `user` call the function
        ecoToken.mint(user, 50 * 1e18); // Should revert because `user` is not the owner
    }
}
