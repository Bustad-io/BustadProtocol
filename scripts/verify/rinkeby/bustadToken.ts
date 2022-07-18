import BustadTokenJSON from '../../../deployments/rinkeby/BustadToken.json';
const hre = require("hardhat");

export async function main() {
    const bustadTokenAddress = BustadTokenJSON.address;
    const bustadTokeConstructorArguments = BustadTokenJSON.args;

    await hre.run("verify:verify", {
        address: bustadTokenAddress,
        constructorArguments: bustadTokeConstructorArguments
      });  
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
