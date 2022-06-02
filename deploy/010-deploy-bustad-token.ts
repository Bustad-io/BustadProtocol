import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { fromEther } from "../utils/format";
import { ethers } from "hardhat";
import {  
  TOKEN_MINTING_TYPE,
  TOKEN_NAME,
  TOKEN_SYMBOL,  
  TOKEN_TRANSFER_TYPE,
  INITIAL_TOKEN_AMOUNT,
} from "../helper-hardhat-config";

const deployToken: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;

  const { deploy } = deployments;
  const { admin } = await getNamedAccounts();
  await deploy("BustadToken", {
    from: admin,
    args: [
      TOKEN_NAME,
      TOKEN_SYMBOL,
      fromEther(INITIAL_TOKEN_AMOUNT),
      0,
      0,
      admin,
      TOKEN_TRANSFER_TYPE,
      TOKEN_MINTING_TYPE,
    ],
    log: true,
    waitConfirmations: 1,
  });

  if(!network.live) {
    const bustadToken = await ethers.getContract("BustadToken", admin);

    await bustadToken.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
      admin
    );
  }
};

export default deployToken;
deployToken.tags = ["BustadToken", "Minting"];
