// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EcoToken} from "../src/EcoToken.sol";

contract MedicineDisposal is Ownable {
    EcoToken public ecoToken;
    uint256 public constant REWARD_PER_DISPOSAL = 10 * 1e18; // Fixed reward (10 EcoTokens)
    uint256 public constant MEDICINE_PRICE = 15 * 1e18; // Fixed price (15 EcoTokens)

    struct DisposalRecord {
        address user;
        uint256 timestamp;
        uint256 reward;
        bool verified;
    }

    struct PurchaseRecord {
        address user;
        uint256 medicineId;
        uint256 amount;
        uint256 timestamp;
    }

    struct Medicine {
        uint256 id;
        string name;
        uint256 price;
    }

    mapping(address => DisposalRecord[]) public disposalHistory;
    mapping(address => uint256) public totalRewards;
    mapping(uint256 => Medicine) public medicines;
    mapping(address => PurchaseRecord[]) public purchaseHistory;
    uint256 public totalMedicines;
    uint256 public pharmacyBalance;

    event MedicineDisposed(address indexed user, uint256 reward, uint256 timestamp);
    event DisposalVerified(address indexed user, uint256 index);
    event MedicinePurchased(address indexed user, uint256 medicineId, uint256 amount, uint256 timestamp);

    constructor(address _ecoToken) Ownable(msg.sender) {
        ecoToken = EcoToken(_ecoToken);
    }

    function disposeMedicine() external {
        disposalHistory[msg.sender].push(DisposalRecord(msg.sender, block.timestamp, REWARD_PER_DISPOSAL, false));
        emit MedicineDisposed(msg.sender, REWARD_PER_DISPOSAL, block.timestamp);
    }

    function verifyDisposal(address _user, uint256 _index) external onlyOwner {
        require(_index < disposalHistory[_user].length, "Invalid Index");
        require(!disposalHistory[_user][_index].verified, "Already Verified");

        disposalHistory[_user][_index].verified = true;
        ecoToken.mint(_user, disposalHistory[_user][_index].reward);
        totalRewards[_user] += disposalHistory[_user][_index].reward;
    }

    function addMedicine(string memory _name, uint256 _price) external onlyOwner {
        medicines[totalMedicines] = Medicine(totalMedicines, _name, _price);
        totalMedicines++;
    }

    function buyMedicine(uint256 _medicineId, uint256 _amount) external {
        require(medicines[_medicineId].id == _medicineId, "Invalid medicine");
        uint256 cost = MEDICINE_PRICE * _amount;
        require(ecoToken.balanceOf(msg.sender) >= cost, "Not enough tokens");

        ecoToken.transferFrom(msg.sender, address(this), cost);
        pharmacyBalance += cost;

        purchaseHistory[msg.sender].push(PurchaseRecord(msg.sender, _medicineId, _amount, block.timestamp));

        emit MedicinePurchased(msg.sender, _medicineId, _amount, block.timestamp);
    }

    function getMedicines() external view returns (Medicine[] memory) {
        Medicine[] memory allMedicines = new Medicine[](totalMedicines);
        for (uint256 i = 0; i < totalMedicines; i++) {
            allMedicines[i] = medicines[i];
        }
        return allMedicines;
    }

    function getPurchaseHistory(address _user) external view returns (PurchaseRecord[] memory) {
        return purchaseHistory[_user];
    }

    function withdrawPharmacyBalance() external onlyOwner {
        require(pharmacyBalance > 0, "No balance to withdraw");
        ecoToken.transfer(msg.sender, pharmacyBalance);
        pharmacyBalance = 0;
    }
}
