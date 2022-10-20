import { getRandomArbitrary, getRandomInt, randomCadastralNumber } from "../../utils/random";

const hre = require("hardhat");

export async function main() {
  const network = hre.network.name;

  const { default: ContractJSON } = await import(`../../deployments/${network}/BustadAssetOracleSimulator.json`);

  const contractAddress = ContractJSON.address;
  const [signer] = await hre.ethers.getSigners();

  const contract = await hre.ethers.getContractAt("BustadAssetOracleSimulator", contractAddress, signer);

  const tx = await contract.removeRealEstate('91/4/5/3','', hre.ethers.utils.parseEther('10000000'), Date.parse('2022-06-15'), hre.ethers.utils.parseEther('0.2072493625242084'))

  console.log(tx);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

