import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployAssetOracle: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre;

  const { deploy, get } = deployments;
  const { admin } = await getNamedAccounts();


  await deploy("BustadAssetOracleSimulatorV2", {
    from: admin,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  if(!network.live) {
    const contract = await ethers.getContract("BustadAssetOracleSimulatorV2", admin);

    await contract.grantRole(
      ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("MAINTAINER_ROLE")),
      admin
    );
  }

};

export default deployAssetOracle;
deployAssetOracle.tags = ["AssetOracleSimulator"];