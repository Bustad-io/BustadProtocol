import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { fromEther } from "../utils/format";
import {
  TOKEN_MINTING_FEE,
  TOKEN_MINTING_TYPE,
  TOKEN_NAME,
  TOKEN_SYMBOL,
  TOKEN_TRANSFER_FEE,
  TOKEN_TRANSFER_TYPE,
  INITIAL_TOKEN_AMOUNT,
} from "../helper-hardhat-config";

const deployToken: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments } = hre;

  const { deploy } = deployments;
  const { admin } = await getNamedAccounts();
  await deploy("BustadToken", {
    from: admin,
    args: [
      TOKEN_NAME,
      TOKEN_SYMBOL,
      fromEther(INITIAL_TOKEN_AMOUNT),
      fromEther(TOKEN_TRANSFER_FEE),
      fromEther(TOKEN_MINTING_FEE),
      admin,
      TOKEN_TRANSFER_TYPE,
      TOKEN_MINTING_TYPE,
    ],
    log: true,
    waitConfirmations: 1,
  });
};

export default deployToken;
deployToken.tags = ["BustadToken", "Minting"];
