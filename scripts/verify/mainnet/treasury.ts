import JSON from '../../../deployments/mainnet/Treasury.json';
const hre = require("hardhat");

export async function main() {
    const ContractAddress = JSON.address;
    const ConstructorArguments = JSON.args;

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
