// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ISwap {
    function swapETH(address toToken) external payable returns (uint256);
    function estimateETHSwap(uint256 amount, address toToken) external returns (uint256);
}
