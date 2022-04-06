import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getExternalContract } from "../utils/helpers";
import { SWAP_POOL_FEE } from "../helper-hardhat-config";
import { ethers } from "hardhat";
import { fromEther } from "../utils/format";

const deploySwap: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;

  const weth9Contract = getExternalContract("WETH9", network.name);
  const swapRouterContract = getExternalContract("SwapRouter", network.name);
  const quoterContract = getExternalContract("Quoter", network.name);

  const { deploy, get } = deployments;
  const { admin } = await getNamedAccounts();

  if(network.live) {
    await deploy("Swap", {
      from: admin,
      args: [swapRouterContract, quoterContract, weth9Contract, SWAP_POOL_FEE],
      log: true,
      waitConfirmations: 1,
    });
  } else {
    const ETH_TO_USD_RATE = 1000;

    const daiTest = await ethers.getContract("DaiTest");

    const swapTest = await deploy("SwapTest", {
      from: admin,
      args: [ETH_TO_USD_RATE, daiTest.address],
      log: true,
      waitConfirmations: 1,
    });

    await (await daiTest.mint(swapTest.address, fromEther(1_000_000))).wait();    
  }
};

export default deploySwap;
deploySwap.tags = ["Swap", "Minting"];
