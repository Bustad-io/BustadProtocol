import { getRandomArbitrary, getRandomInt, randomCadastralNumber } from "../../utils/random";

const hre = require("hardhat");

export async function main() {
  const network = hre.network.name;

  const { default: ContractJSON } = await import(`../../deployments/${network}/BustadAssetOracleSimulatorV2.json`);

  const contractAddress = ContractJSON.address;
  const [signer] = await hre.ethers.getSigners();

  const contract = await hre.ethers.getContractAt("BustadAssetOracleSimulatorV2", contractAddress, signer);

  const tx = await contract.addRealEstate(randomCadastralNumber(),/* '', */ hre.ethers.utils.parseEther(`${getRandomInt(10, 101)}00000`), Date.parse(`2022-${getRandomInt(1, 11)}-${getRandomInt(1, 30)}`), hre.ethers.utils.parseEther(getRandomArbitrary(0.05, 0.21).toString()))

  console.log(tx);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

