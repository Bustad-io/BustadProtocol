import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { fromEther } from "../utils/format";
import {  
  TREASURY_MAX_RELEASE_AMOUNT,
} from "../helper-hardhat-config";
import { BustadToken, GovernanceToken } from "../typechain";

const deployTreasury: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, ethers } = hre;

  const { deploy, get } = deployments;
  const { admin } = await getNamedAccounts();
  const masterReleaseFund = await get("ReleaseFund");
  const governanceToken = <GovernanceToken>  await ethers.getContract("GovernanceToken", admin);  
  const token = <BustadToken> await ethers.getContract("BustadToken", admin);  

  const treasury = await deploy("Treasury", {
    from: admin,
    args: [
      masterReleaseFund.address,
      governanceToken.address,
      token.address,
      0,
      0,
      fromEther(TREASURY_MAX_RELEASE_AMOUNT)
    ],
    log: true,
    waitConfirmations: 1,
  });

  /* await token.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MAINTAINER_ROLE")),
    admin
  );

  await governanceToken.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SNAPSHOTER_ROLE")),treasury.address);

  await token.setFeeCollector(treasury.address); */
};

export default deployTreasury;
deployTreasury.tags = ["Treasury", "Minting"];
