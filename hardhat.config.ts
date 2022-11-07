import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";

dotenv.config();

task("run-verify", "Verifies smart contract in Etherscan")
  .addParam("contractname", "Name of the deployed contract")
  .setAction(async (taskArgs, hre) => {
    const network = hre.network.name;
    const { default: ContractJSON } = await import(`./deployments/${network}/${taskArgs.contractname}.json`);

    const contractAddress = ContractJSON.address;
    const contractConstructorArguments = ContractJSON.args;

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: contractConstructorArguments
    });
  });

const accounts = [
  process.env.PERSONAL_PRIVATE_KEY || "",
  process.env.BUSTAD_PRIVATE_KEY || "",
  process.env.MOCK_USER_PRIVATE_KEY || "",
];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000
      }
    }
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_URL !== undefined ? process.env.GOERLI_URL : "",
      accounts: accounts,
    },
    mainnet: {
      url: process.env.MAINNET_URI !== undefined ? process.env.MAINNET_URI : "",
      accounts: accounts,
    },
    localhost: {
      gas: 2100000,
      gasPrice: 9300000000,
    },
    hardhat: {
      chainId: 1337,
      forking: {
        url: process.env.FORK_URI !== undefined ? process.env.FORK_URI : "",
        blockNumber: 14882800,
        enabled: false
      },
      accounts: accounts.map((acc) => ({
        privateKey: acc,
        balance: (100 * Math.pow(10, 18)).toString(),
      })),
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    admin: {
      default: 0,
    },
    bustad: {
      default: 1,
    },
    mockUser: {
      default: 2,
    },
  },
};

export default config;