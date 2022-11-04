const hre = require("hardhat");

export async function main() {
  const network = hre.network.name;
  const { default: ContractJSON } = await import(`../../deployments/${network}/BustadAssetOracleSimulatorV2.json`);

    const contractAddress = ContractJSON.address;
    const contractConstructorArguments = contractAddress.args;

    await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: contractConstructorArguments
      });  
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
