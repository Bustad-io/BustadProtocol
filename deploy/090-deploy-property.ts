import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { getExternalContract } from "../utils/helpers";
import { keccak256 } from "ethers/lib/utils";

const deployProperty: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;

  const { deploy, get } = deployments;
  const { admin, horde } = await getNamedAccounts();

  await deploy("Property", {
    from: admin,
    args: [],
    log: true,
    waitConfirmations: 1,
  });
};

export default deployProperty;
deployProperty.tags = ["Property"];
