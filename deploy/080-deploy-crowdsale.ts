import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { getExternalContract } from "../utils/helpers";
import { fromEther } from "../utils/format";

const deployCrowdsale: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;

  const { deploy, get } = deployments;
  const { admin, horde } = await getNamedAccounts();

  const bustadToken = await ethers.getContract("BustadToken", admin);  
  const treasury = await get("Treasury");

  if(network.live) {
    const daiContract = getExternalContract("DAI", network.name);
    const usdcContract = getExternalContract("USDC", network.name);
    const swap = await get("Swap");

    await deploy("Crowdsale", {
      from: admin,
      args: [
        horde,
        treasury.address,
        daiContract,
        bustadToken.address,
        swap.address,
        ethers.constants.WeiPerEther,
        [daiContract, usdcContract],
      ],
      log: true,
      waitConfirmations: 1,
    });
  } else {
    const daiTest = await ethers.getContract("DaiTest", admin);
    const swapTest = await get("SwapTest");

    await deploy("Crowdsale", {
      from: admin,
      args: [
        horde,
        treasury.address,
        daiTest.address,
        bustadToken.address,
        swapTest.address,
        ethers.constants.WeiPerEther,
        [daiTest.address],
      ],
      log: true,
      waitConfirmations: 1,
    });
  }

  const crowdsale = await ethers.getContract("Crowdsale", admin);
  
  await bustadToken.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
    crowdsale.address
  );

  await crowdsale.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MAINTAINER_ROLE")),
    admin
  );
};

export default deployCrowdsale;
deployCrowdsale.tags = ["Crowdsale", "Minting"];
