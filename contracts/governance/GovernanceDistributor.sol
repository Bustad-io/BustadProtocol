// SPDX-License-Identifier: MIT
/* solhint-disable not-rely-on-time */
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./GovernanceToken.sol";
import "../BustadToken.sol";

contract GovernanceDistributor is AccessControl {
    using SafeMath for uint256;

    mapping(address => uint256) public userGovTokenShareMapping;

    GovernanceToken public govToken;    

    uint256 public decayThreshold;
    uint256 public amountLeftToDistribute;
    uint256 public lastRatioDecreaseDate;
    uint256 public ratioDecreaseInterval;
    uint256 public bustadToGovDistributionRatio;

    bytes32 public constant MAINTAINER_ROLE = keccak256("MAINTAINER_ROLE");
    bytes32 public constant CROWDSALE_ROLE = keccak256("CROWDSALE_ROLE");

    constructor(GovernanceToken _govToken, uint256 initialDistributionRatio) {
        bustadToGovDistributionRatio = initialDistributionRatio;
        lastRatioDecreaseDate = block.timestamp;
        ratioDecreaseInterval = 90 days;
        govToken = _govToken;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function addBuyer(address userAddress, uint256 bustadAmountBought)
        external
        onlyRole(CROWDSALE_ROLE)
    {
        if (amountLeftToDistribute == 0) return;

        if (block.timestamp > lastRatioDecreaseDate + ratioDecreaseInterval) {
            bustadToGovDistributionRatio /= 2;
            lastRatioDecreaseDate = block.timestamp;
        }

        uint256 govTokenShare = getGovTokenShare(bustadAmountBought);

        amountLeftToDistribute -= govTokenShare;
        userGovTokenShareMapping[userAddress] += govTokenShare;
    }

    function withdraw() external {
        address receiver = msg.sender;
        uint256 govTokenShare = userGovTokenShareMapping[receiver];        

        require(
            govToken.balanceOf(address(this)) > 0,
            "No more tokens to withdraw"
        );
        require(
            govTokenShare <= govToken.balanceOf(address(this)),
            "govTokenShare surpasses balance"
        );
        require(
            userGovTokenShareMapping[receiver] > 0,
            "User has no funds to withdraw"
        );

        userGovTokenShareMapping[receiver] -= govTokenShare;

        govToken.transfer(receiver, govTokenShare);
    }

    function getGovTokenShareForUser(address _userAddress)
        external
        view
        returns (uint256)
    {        
        return userGovTokenShareMapping[_userAddress];
    }

    function setAmountLeftToDistribute(uint256 _amountLeftToDistribute)
        external
        onlyRole(MAINTAINER_ROLE)
    {
        require(
            govToken.balanceOf(address(this)) == _amountLeftToDistribute,
            "Amount not equal to balance"
        );
        amountLeftToDistribute = _amountLeftToDistribute;
    }

    function setRatioDecreaseInterval(uint256 _ratioDecreaseInterval)
        external
        onlyRole(MAINTAINER_ROLE)
    {
        ratioDecreaseInterval = _ratioDecreaseInterval;
    }

    function getGovTokenShare(uint256 bustadAmountBought)
        private
        view
        returns (uint256)
    {
        return (bustadAmountBought.mul(bustadToGovDistributionRatio)).div(1 ether);
    }
}