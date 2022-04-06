// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Property is Ownable {
    enum PropertyStatus {
        Active,
        Sold
    }

    struct PurchasedProperty {
        bytes32 Id;
        bytes32 cadastralNumber;
        string purchaseDate;
        uint256 estimatedValue;
        uint256 purchaseAmount;
        uint256 soldAmount;
        uint8 shareOfPropertyInPct;
        PropertyStatus status;
    }

    mapping(bytes32 => PurchasedProperty) public propertyList;

    uint256 numberOfActiveProperties;
    uint256 numberOfSoldProperties;    

    event PropertyPurchased(bytes32 id, bytes32 cadastralNumber, uint256 estimatedValue, string purchaseDate, uint256 purchaseAmount, uint8 shareOfPropertyInPct);
    event PropertySold(bytes32 id, uint256 soldAmount);

    constructor() {}

    function getProperty(bytes32 id) external view returns (PurchasedProperty memory) {
        return propertyList[id];        
    }

    function addActiveProperty(bytes32 id, PurchasedProperty memory _prop) external onlyOwner {
        require(_prop.status == PropertyStatus.Active, "Property must have active status");
        require(_prop.estimatedValue > 0, "invalid estimatedValue");
        require(_prop.purchaseAmount > 0, "invalid purchaseAmount");
        require(_prop.shareOfPropertyInPct > 0, "invalid shareOfPropertyInPct");
        require(_prop.soldAmount == 0, "Sold amount must be 0");

        propertyList[id] = _prop;        

        numberOfActiveProperties += 1;
        
        emit PropertyPurchased(_prop.Id, _prop.cadastralNumber, _prop.estimatedValue, _prop.purchaseDate, _prop.purchaseAmount, _prop.shareOfPropertyInPct);        
    }

    function setPropertyAsSold(bytes32 id, uint256 amount) external onlyOwner {
        PurchasedProperty storage property = propertyList[id];

        require(property.Id != 0, "Invalid property id");

        property.status = PropertyStatus.Sold;
        property.soldAmount = amount;

        numberOfSoldProperties += 1;

        emit PropertySold(id, amount);
    }

    function removeProperty(bytes32 id) external onlyOwner {
        propertyList[id] = PurchasedProperty(0, "","", 0,0,0,0,PropertyStatus.Active);
    }
}
