import CrowdsaleJSON from '../../../deployments/mainnet/Crowdsale.json';

const hre = require("hardhat");

export async function main() {
    const crowdsaleAddress = CrowdsaleJSON.address;
    const crowdsaleConstructorArguments = CrowdsaleJSON.args;

    await hre.run("verify:verify", {
        address: crowdsaleAddress,
        constructorArguments: crowdsaleConstructorArguments
      });  
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
