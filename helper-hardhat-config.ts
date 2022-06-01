import { TokenFeeType } from "./constants/TokenFeeType";

export const TOTAL_GOV_TOKEN_AMOUNT = 300_000_000;
export const TOTAL_GOV_TOKEN_DISTRIBUTION_AMOUNT = 100_000_000;
export const MOCK_USER_GOV_SHARE = 0.1;

export const INITIAL_TOKEN_AMOUNT = 1;
export const TOKEN_NAME = "Bustad Coin";
export const TOKEN_SYMBOL = "BUC";
export const TOKEN_DECIMALS = 18;

export const RELEASE_FUND_BALANCE = 750_000;

export const TREASURY_BALANCE = 750_000;
export const TREASURY_MAX_RELEASE_AMOUNT = 100_000;

export const TOKEN_MINTING_FEE = 0.03;
export const TOKEN_TRANSFER_FEE = 0;
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
            }
        ]
    },
    {
        name: "WETH9",
        addresses: [
            {
                network: "mainnet",
                address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
            },
            {
                network: "hardhat",
                address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
            },
            {
                network: "localhost",
                address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
            },
            {
                network: "ropsten",
                address: "0xc778417E063141139Fce010982780140Aa0cD5Ab"
            },
            {
                network: "rinkeby",
                address: "0xc778417E063141139Fce010982780140Aa0cD5Ab"
            }
        ]
    },
    {
        name: "Quoter",
        addresses: [
            {
                network: "mainnet",
                address: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
            },
            {
                network: "hardhat",
                address: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
            },
            {
                network: "localhost",
                address: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
            },
            {
                network: "ropsten",
                address: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
            },
            {
                network: "rinkeby",
                address: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
            }
        ]
    }
];
