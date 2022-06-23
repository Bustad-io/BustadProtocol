import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { fromEther } from "../utils/format";

const deployGovernanceDistributor: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;

  const { deploy, get } = deployments;
  const { admin } = await getNamedAccounts();
  const governanceToken = await get("GovernanceToken");

  await deploy("GovernanceDistributor", {
    from: admin,
    args: [governanceToken.address, fromEther(1)],
    log: true,
    waitConfirmations: 1,
  });

  const governanceDistributor = await ethers.getContract("GovernanceDistributor", admin);

  if(!network.live) {    
    await governanceDistributor.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CROWDSALE_ROLE")),
      admin
    );    
  } else {
    const crowdsale = await ethers.getContract("Crowdsale", admin);

    await governanceDistributor.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CROWDSALE_ROLE")),
      crowdsale.address
    );    
  }

  await governanceDistributor.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MAINTAINER_ROLE")),
    admin
  );
};

export default deployGovernanceDistributor;
deployGovernanceDistributor.tags = ["GovernanceDistributor"];
