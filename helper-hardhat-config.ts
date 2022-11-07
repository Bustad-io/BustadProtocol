import { TokenFeeType } from "./constants/TokenFeeType";

export const TOTAL_GOV_TOKEN_AMOUNT = 100_000_000;
export const TOTAL_GOV_TOKEN_DISTRIBUTION_AMOUNT = 50_000_000;
export const TEST_USER_GOV_TOKEN_AMOUNT = 15_000;

export const INITIAL_TOKEN_AMOUNT = 840;
export const TOKEN_NAME = "Bustad Coin";
export const TOKEN_SYMBOL = "BUSC";
export const TOKEN_DECIMALS = 18;
export const GOV_TOKEN_NAME = "Eigar";
export const GOV_TOKEN_SYMBOL = "EIG";

export const RELEASE_FUND_BALANCE = 750_000;

export const TREASURY_BALANCE = 750_000;
export const TREASURY_MAX_RELEASE_AMOUNT = 100_000;

export const TOKEN_MINTING_TYPE = TokenFeeType.Percentage;
export const TOKEN_TRANSFER_TYPE = TokenFeeType.Fixed;

export const ETH_PRICE = 1952.41000000

export const BUSTAD_MULTISIG_ADDRESS = '0xEB9baEDB8e7D0875aF990368a6A82aDfd199F6f3'

export const EXTERNAL_CONTRACT_ADDRESSES = [
    {
        name: "DAI",
        addresses: [
            {
                network: "mainnet",
                address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            },
            {
                network: "goerli",
                address: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844"
            },
            {
                network: "hardhat",
                address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            },
            {
                network: "localhost",
                address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            }
        ],
    },
    {
        name: "USDC",
        addresses: [
            {
                network: "mainnet",
                address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            },
            {
                network: "hardhat",
                address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            },
            {
                network: "localhost",
                address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            },
            {
                network: "goerli",
                address: "0x6Fb5ef893d44F4f88026430d82d4ef269543cB23"
            }
        ]
    },
    {
        name: "PriceFeed",
        addresses: [
            {
                network: "mainnet",
                address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
            },
            {
                network: "hardhat",
                address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
            },
            {
                network: "localhost",
                address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
            },
            {
                network: "goerli",
                address: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
            }
        ]
    }
];
