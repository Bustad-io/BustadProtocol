import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { getExternalContract } from "../utils/helpers";
import { fromEther } from "../utils/format";
import { ETH_PRICE } from "../helper-hardhat-config";

const deployCrowdsale: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;

  const { deploy, get } = deployments;
  const { admin, bustad } = await getNamedAccounts();

  const bustadToken = await ethers.getContract("BustadToken", admin);  
  const treasury = await get("Treasury");

  if(network.live) {
    const daiContract = getExternalContract("DAI", network.name);
    const usdcContract = getExternalContract("USDC", network.name);
    const priceFeedContract = getExternalContract("PriceFeed", network.name);

    await deploy("Crowdsale", {
      from: admin,
      args: [
        bustad,        
        bustadToken.address,        
        ethers.constants.WeiPerEther,
        [daiContract, usdcContract],
        priceFeedContract
      ],
      log: true,
      waitConfirmations: 1,
    });
  } else {
    const daiTest = await ethers.getContract("DaiTest", admin);

    await deploy("PriceFeedTest", {
      from: admin,
      args: [
        ETH_PRICE * 10 ** 8
      ],
      log: true,
      waitConfirmations: 1,
    });

    const priceFeedTest = await ethers.getContract("PriceFeedTest", admin);

    await deploy("Crowdsale", {
      from: admin,
      args: [
        bustad,                
        bustadToken.address,        
        ethers.constants.WeiPerEther,
        [daiTest.address],
        priceFeedTest.address
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
