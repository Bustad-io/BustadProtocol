import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployAssetOracle: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;

  const { deploy, get } = deployments;
  const { admin, bustad } = await getNamedAccounts();


  await deploy("BustadAssetOracleSimulator", {
    from: admin,
    args: [],
    log: true,
    waitConfirmations: 1,
  });
};

export default deployAssetOracle;
deployAssetOracle.tags = ["AssetOracle"];
