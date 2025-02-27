// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/EcoToken.sol";
import "../src/MedicineDisposal.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MedicineDisposalTest is Test {
    EcoToken public ecoToken;
    MedicineDisposal public medicineDisposal;
    address public user = address(0x123);

    function setUp() public {
        ecoToken = new EcoToken();
        medicineDisposal = new MedicineDisposal(address(ecoToken));
    }

    function testDisposeMedicine() public {
        // Arrange
        vm.prank(user);
        medicineDisposal.disposeMedicine();

        // Act
        (address disposedUser, uint256 timestamp, uint256 reward, bool verified) =
            medicineDisposal.disposalHistory(user, 0);

        // Assert
        assertEq(disposedUser, user);
        assertEq(reward, 10 * 1e18);
        assertEq(verified, false);
        assertGt(timestamp, 0);
    }

    function testAddMedicine() public {
        // Arrange
        vm.prank(medicineDisposal.owner());
        medicineDisposal.addMedicine("Aspirin", 15 * 1e18);

        // Act
        MedicineDisposal.Medicine[] memory medicines = medicineDisposal.getMedicines();

        // Assert
        assertEq(medicines.length, 1);
        assertEq(medicines[0].name, "Aspirin");
        assertEq(medicines[0].price, 15 * 1e18);
    }

    function testBuyMedicine() public {
        // Arrange
        vm.prank(medicineDisposal.owner());
        medicineDisposal.addMedicine("Aspirin", 15 * 1e18);
        vm.prank(medicineDisposal.owner());
        ecoToken.mint(user, 20 * 1e18);

        // Act
        vm.startPrank(user);
        ecoToken.approve(address(medicineDisposal), 15 * 1e18);
        medicineDisposal.buyMedicine(0, 1);
        vm.stopPrank();

        // Assert
        assertEq(ecoToken.balanceOf(user), 5 * 1e18);
        assertEq(medicineDisposal.pharmacyBalance(), 15 * 1e18);
    }

    function test_Revert_when_BuyingMedicineWithoutTokens() public {
        // Arrange
        vm.prank(medicineDisposal.owner());
        medicineDisposal.addMedicine("Aspirin", 15 * 1e18);

        // Act
        vm.prank(user);

        // Assert
        vm.expectRevert("Not enough tokens");
        medicineDisposal.buyMedicine(0, 1);
    }

    function testPurchaseHistory() public {
        // Arrange
        vm.startPrank(medicineDisposal.owner());
        medicineDisposal.addMedicine("Aspirin", 15 * 1e18);
        ecoToken.mint(user, 20 * 1e18);
        vm.stopPrank();

        // Act
        vm.startPrank(user);
        ecoToken.approve(address(medicineDisposal), 15 * 1e18);
        medicineDisposal.buyMedicine(0, 1);
        vm.stopPrank();

        // Assert
        MedicineDisposal.PurchaseRecord[] memory history = medicineDisposal.getPurchaseHistory(user);
        assertEq(history.length, 1);
        assertEq(history[0].medicineId, 0);
        assertEq(history[0].amount, 1);
    }

    function testWithdrawlPharmacyOwner() public {
        // Arrange
        vm.startPrank(medicineDisposal.owner());
        medicineDisposal.addMedicine("Aspirin", 15 * 1e18);
        ecoToken.mint(user, 20 * 1e18);
        vm.stopPrank();

        // Act
        vm.startPrank(user);
        ecoToken.approve(address(medicineDisposal), 15 * 1e18);
        medicineDisposal.buyMedicine(0, 1);
        vm.stopPrank();

        // Assert
        uint256 ownerBalanceBefore = ecoToken.balanceOf(medicineDisposal.owner());
        vm.prank(medicineDisposal.owner());
        medicineDisposal.withdrawPharmacyBalance();

        assertEq(ecoToken.balanceOf(medicineDisposal.owner()), ownerBalanceBefore + 15 * 1e18);
        assertEq(medicineDisposal.pharmacyBalance(), 0);
    }

    function test_Revert_when_NonOwnerIsWithdrawingBalance() public {
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user));
        medicineDisposal.withdrawPharmacyBalance();
    }
}
