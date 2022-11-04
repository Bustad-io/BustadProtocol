import { getRandomArbitrary, getRandomInt, randomCadastralNumber } from "../../utils/random";

const hre = require("hardhat");

export async function main() {
  const network = hre.network.name;

  const { default: ContractJSON } = await import(`../../deployments/${network}/BustadAssetOracleSimulatorV2.json`);

  const contractAddress = ContractJSON.address;
  const [signer] = await hre.ethers.getSigners();

  const contract = await hre.ethers.getContractAt("BustadAssetOracleSimulatorV2", contractAddress, signer);

  const tx = await contract.updateRealEstateValue('91/2/9/3', hre.ethers.utils.parseEther('10500000'), Date.parse(`2022-03-01`))

  console.log(tx);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

