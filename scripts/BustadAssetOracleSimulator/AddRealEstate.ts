const hre = require("hardhat");

export async function main() {
  const network = hre.network.name;

  const { default: ContractJSON } = await import(`../../deployments/${network}/BustadAssetOracleSimulator.json`);

  const contractAddress = ContractJSON.address;
  const [signer] = await hre.ethers.getSigners();

  const contract = await hre.ethers.getContractAt("BustadAssetOracleSimulator", contractAddress, signer);

  await contract.addRealEstate('123', 'test', hre.ethers.utils.parseEther('1000000'), Date.now(), hre.ethers.utils.parseEther('0.1'))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });