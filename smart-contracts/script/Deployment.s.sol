// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {EcoToken} from "../src/EcoToken.sol";
import {MedicineDisposal} from "../src/MedicineDisposal.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast(); // Start broadcasting transactions

        // Deploy EcoToken
        EcoToken ecoToken = new EcoToken();
        console.log("EcoToken deployed at:", address(ecoToken));

        // Deploy MedicineDisposal with the address of EcoToken
        MedicineDisposal medicineDisposal = new MedicineDisposal(address(ecoToken));
        console.log("MedicineDisposal deployed at:", address(medicineDisposal));

        vm.stopBroadcast(); // Stop broadcasting transactions
    }
}
