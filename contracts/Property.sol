pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Property is Ownable {
    enum BustadPropertyStatus {
        Active,
        Sold
    }

    struct BustadProperty {
        bytes32 Id;
        string cadastralNumber;
        string purchaseDate;
        uint256 estimatedValue;
        uint256 purchaseAmount;
        uint256 soldAmount;
        uint8 shareOfPropertyInPct;
        BustadPropertyStatus status;
    }

    mapping(bytes32 => BustadProperty) public propertyList;

    uint256 numberOfActiveProperties;
    uint256 numberOfSoldProperties;    

    event PropertyPurchased(bytes32 id, string cadastralNumber, uint256 estimatedValue, string purchaseDate, uint256 purchaseAmount, uint8 shareOfPropertyInPct);
    event PropertySold(bytes32 id, uint256 soldAmount);

    constructor() {}

    function getProperty(bytes32 id) external view returns (BustadProperty memory) {
        return propertyList[id];        
    }

    function addActiveProperty(bytes32 id, BustadProperty memory _prop) external onlyOwner {
        require(_prop.status == BustadPropertyStatus.Active, "Property must have active status");
        require(_prop.estimatedValue > 0, "invalid estimatedValue");
        require(_prop.purchaseAmount > 0, "invalid purchaseAmount");
        require(_prop.shareOfPropertyInPct > 0, "invalid shareOfPropertyInPct");
        require(_prop.soldAmount == 0, "Sold amount must be 0");

        propertyList[id] = _prop;        

        numberOfActiveProperties += 1;
        
        emit PropertyPurchased(_prop.Id, _prop.cadastralNumber, _prop.estimatedValue, _prop.purchaseDate, _prop.purchaseAmount, _prop.shareOfPropertyInPct);        
    }

    function setPropertyAsSold(bytes32 id, uint256 amount) external onlyOwner {
        BustadProperty storage property = propertyList[id];

        require(property.Id != 0, "Invalid property id");

        property.status = BustadPropertyStatus.Sold;
        property.soldAmount = amount;

        numberOfSoldProperties += 1;

        emit PropertySold(id, amount);
    }

    function removeProperty(bytes32 id) external onlyOwner {
        propertyList[id] = BustadProperty(0, "","", 0,0,0,0,BustadPropertyStatus.Active);
    }
}
