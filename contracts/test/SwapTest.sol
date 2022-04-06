// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../interfaces/ISwap.sol";
import "./DaiTest.sol";

contract SwapTest is ISwap {
    uint16 private _ethRate;
    DaiTest private _daiContract;

    constructor(
        uint16 ethRate,
        DaiTest daiContract
    ) {
        _ethRate = ethRate;
        _daiContract = daiContract;
    }

    function swapETH(address toToken) external payable returns (uint256) {
        uint256 amount = msg.value * _ethRate;
        _daiContract.transfer(msg.sender, amount);
        return msg.value * _ethRate;
    }

    function estimateETHSwap(uint256 amount, address toToken)
        external
        returns (uint256)
    {
        return amount * _ethRate;       
    }
}
