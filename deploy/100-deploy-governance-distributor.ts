import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployGovernanceDistributor: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;

  const { deploy } = deployments;
  const { admin } = await getNamedAccounts();

  await deploy("GovernanceDistributor", {
    from: admin,
    args: [100],
    log: true,
    waitConfirmations: 1,
  });

  if(!network.live) {
    const governanceDistributor = await ethers.getContract("GovernanceDistributor", admin);

    await governanceDistributor.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CROWDSALE_ROLE")),
      admin
    );
  }
};

export default deployGovernanceDistributor;
deployGovernanceDistributor.tags = ["GovernanceDistributor"];
