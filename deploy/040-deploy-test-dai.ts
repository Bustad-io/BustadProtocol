import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { fromEther } from "../utils/format";

const deployTestDai: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;

  const { deploy } = deployments;
  const { admin, mockUser } = await getNamedAccounts();

  if(!network.live) {
    await deploy("DaiTest", {
      from: admin,
      args: [network.config.chainId],
      log: true,
      waitConfirmations: 1,
    });

    const daiTest = await ethers.getContract("DaiTest");

    await (await daiTest.mint(mockUser, fromEther(1_000_000))).wait();    
  } 
};

export default deployTestDai;
deployTestDai.tags = ["Dai"];
