import GovTokenJSON from '../../../deployments/mainnet/GovernanceToken.json';
const hre = require("hardhat");

export async function main() {
    const ContractAddress = GovTokenJSON.address;
    const ConstructorArguments = GovTokenJSON.args;

    await hre.run("verify:verify", {
        address: ContractAddress,
        constructorArguments: ConstructorArguments
      });  
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
