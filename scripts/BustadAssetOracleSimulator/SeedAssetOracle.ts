import { getRandomArbitrary, getRandomInt, randomCadastralNumber } from "../../utils/random";

const hre = require("hardhat");

export async function main() {
  const network = hre.network.name;

  const { default: ContractJSON } = await import(`../../deployments/${network}/BustadAssetOracleSimulatorV2.json`);

  const contractAddress = ContractJSON.address;
  const [signer] = await hre.ethers.getSigners();

  const contract = await hre.ethers.getContractAt("BustadAssetOracleSimulatorV2", contractAddress, signer);

  const data = [
    {
      cadastralNumber: '165/67/0/32',
      value: '6000000',
      date: Date.parse('2022-10-19'),
      share: 0.2
    },
    {
      cadastralNumber: '23/4/2/5',
      value: '5500000',
      date: Date.parse('2022-09-11'),
      share: 0.17
    },
    {
      cadastralNumber: '45/8/7/10',
      value: '2900000',
      date: Date.parse('2022-05-27'),
      share: 0.1548    
    },
    {
      cadastralNumber: '9/3/3/1',
      value: '6500000',
      date: Date.parse('2022-04-25'),
      share: 0.0518
    },
    {
      cadastralNumber: '46/2/9/0',
      value: '5900000',
      date: Date.parse('2022-06-04'),
      share: 0.1270
    },
    {
      cadastralNumber: '1/4/5/7',
      value: '7200000',
      date: Date.parse('2022-03-28'),
      share: 0.1764
    },
    {
      cadastralNumber: '39/2/1/10',
      value: '8900000',
      date: Date.parse('2022-07-18'),
      share: 0.1565
    },
    {
      cadastralNumber: '91/2/9/3',
      value: '9900000',
      date: Date.parse('2022-01-21'),
      share: 0.0866
    }
  ]

  for (let index = 0; index < data.length; index++) {
    const e = data[index];
    const tx = await contract.addRealEstate(e.cadastralNumber, hre.ethers.utils.parseEther(e.value), e.date, hre.ethers.utils.parseEther(e.share).toString());
    console.log(tx)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

