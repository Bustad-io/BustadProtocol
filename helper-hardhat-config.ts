import { TokenFeeType } from "./constants/TokenFeeType";

export const TOTAL_GOV_TOKEN_AMOUNT = 100_000_000;
export const TOTAL_GOV_TOKEN_DISTRIBUTION_AMOUNT = 50_000_000;
export const TEST_USER_GOV_TOKEN_AMOUNT = 15_000;

export const INITIAL_TOKEN_AMOUNT = 1;
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

export const EXTERNAL_CONTRACT_ADDRESSES = [
    {
        name: "DAI",
        addresses: [
            {
                network: "mainnet",
                address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            },
            {
                network: "ropsten",
                address: "0x31F42841c2db5173425b5223809CF3A38FEde360"
            },
            {
                network: "hardhat",
                address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            },
            {
                network: "localhost",
                address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            },
            {
                network: "rinkeby",
                address: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
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
                network: "ropsten",
                address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"
            },
            {
                network: "rinkeby",
                address: "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b"
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
                network: "rinkeby",
                address: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
            }
        ]
    }
];
