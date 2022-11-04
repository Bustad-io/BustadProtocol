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
      share: 0.2,
      updates: [
        {
          date: Date.parse('2022-11-01'),
          value: '6100000',
        }
      ]
    },
    {
      cadastralNumber: '23/4/2/5',
      value: '5500000',
      date: Date.parse('2022-09-11'),
      share: 0.17,
      updates: [
        {
          date: Date.parse('2022-10-01'),
          value: '5510000',
        },
        {
          date: Date.parse('2022-11-01'),
          value: '5520000',
        }
      ]
    },
    {
      cadastralNumber: '45/8/7/10',
      value: '2900000',
      date: Date.parse('2022-05-27'),
      share: 0.1548,
      updates: [
        {
          date: Date.parse('2022-06-01'),
          value: '2910000',
        },
        {
          date: Date.parse('2022-07-01'),
          value: '2920000',
        },
        {
          date: Date.parse('2022-08-01'),
          value: '2930000',
        },
        {
          date: Date.parse('2022-09-01'),
          value: '2925000',
        },
        {
          date: Date.parse('2022-10-01'),
          value: '2935000',
        },
        {
          date: Date.parse('2022-11-01'),
          value: '2945000',
        }
      ]
    },
    {
      cadastralNumber: '9/3/3/1',
      value: '6500000',
      date: Date.parse('2022-04-25'),
      share: 0.0518,
      updates: [
        {
          date: Date.parse('2022-05-01'),
          value: '6510000',
        },
        {
          date: Date.parse('2022-06-01'),
          value: '6520000',
        },
        {
          date: Date.parse('2022-07-01'),
          value: '6530000',
        },        
        {
          date: Date.parse('2022-08-01'),
          value: '6540000',
        },
        {
          date: Date.parse('2022-09-01'),
          value: '6535000',
        },
        {
          date: Date.parse('2022-10-01'),
          value: '6545000',
        },
        {
          date: Date.parse('2022-11-01'),
          value: '6555000',
        }
      ]
    },
    {
      cadastralNumber: '46/2/9/0',
      value: '5900000',
      date: Date.parse('2022-06-04'),
      share: 0.1270,
      updates: [
        {
          date: Date.parse('2022-07-01'),
          value: '6000000',
        },
        {
          date: Date.parse('2022-08-01'),
          value: '6100000',
        },
        {
          date: Date.parse('2022-09-01'),
          value: '6050000',
        },
         {
          date: Date.parse('2022-10-01'),
          value: '6150000',
        },
        {
          date: Date.parse('2022-11-01'),
          value: '6250000',
        }
      ]
    },
    {
      cadastralNumber: '1/4/5/7',
      value: '7200000',
      date: Date.parse('2022-03-28'),
      share: 0.1764,
      updates: [
        {
          date: Date.parse('2022-04-01'),
          value: '7300000',
        },
        {
          date: Date.parse('2022-05-01'),
          value: '7400000',
        },
        {
          date: Date.parse('2022-06-01'),
          value: '7500000',
        },
        {
          date: Date.parse('2022-07-01'),
          value: '7600000',
        },
        {
          date: Date.parse('2022-08-01'),
          value: '7700000',
        },
        {
          date: Date.parse('2022-09-01'),
          value: '7650000',
        },
        {
          date: Date.parse('2022-10-01'),
          value: '7750000',
        },
        {
          date: Date.parse('2022-11-01'),
          value: '7850000',
        }
      ]
    },
    {
      cadastralNumber: '39/2/1/10',
      value: '8900000',
      date: Date.parse('2022-07-18'),
      share: 0.1565,
      updates: [
        {
          date: Date.parse('2022-08-01'),
          value: '9000000',
        },
        {
          date: Date.parse('2022-09-01'),
          value: '8950000',
        },
        {
          date: Date.parse('2022-10-01'),
          value: '9050000',
        },
        {
          date: Date.parse('2022-11-01'),
          value: '9150000',
        }
      ]
    },
    {
      cadastralNumber: '91/2/9/3',
      value: '9900000',
      date: Date.parse('2022-01-21'),
      share: 0.0866,
      updates: [
        {
          date: Date.parse('2022-02-01'),
          value: '10000000',
        },
        {
          date: Date.parse('2022-03-01'),
          value: '10500000',
        },
        {
          date: Date.parse('2022-04-01'),
          value: '10600000',
        },
        {
          date: Date.parse('2022-05-01'),
          value: '10700000',
        },
        {
          date: Date.parse('2022-06-01'),
          value: '10800000',
        },
        {
          date: Date.parse('2022-07-01'),
          value: '10900000',
        },
        {
          date: Date.parse('2022-08-01'),
          value: '11000000',
        },
        {
          date: Date.parse('2022-09-01'),
          value: '10950000',
        },
        {
          date: Date.parse('2022-10-01'),
          value: '11050000',
        },
        {
          date: Date.parse('2022-11-01'),
          value: '11150000',
        }
      ]
    },
    {
      cadastralNumber: '27/1/3/9',
      value: '7100000',
      date: Date.parse('2022-05-10'),
      share: 0.156,
      sold: true,
      soldTimestamp: Date.parse('2022-10-19'),
      soldValue: '8000000',
      updates: [
        {
          date: Date.parse('2022-06-01'),
          value: '7280000',
        },
        {
          date: Date.parse('2022-07-01'),
          value: '7460000',
        },
        {
          date: Date.parse('2022-08-01'),
          value: '7640000',
        },
        {
          date: Date.parse('2022-09-01'),
          value: '7820000',
        },
        {
          date: Date.parse('2022-10-01'),
          value: '8000000',
        }
      ]
    },
    {
      cadastralNumber: '91/4/5/3',
      value: '9200000',
      date: Date.parse('2022-02-14'),
      share: 0.2072,
      sold: true,
      soldTimestamp: Date.parse('2022-06-14'),
      soldValue: '10000000',
      updates: [
        {
          date: Date.parse('2022-03-01'),
          value: '9360000',
        },
        {
          date: Date.parse('2022-04-01'),
          value: '9520000',
        },
        {
          date: Date.parse('2022-05-01'),
          value: '9680000',
        },
        {
          date: Date.parse('2022-06-01'),
          value: '9840000',
        }
      ]
    }
  ]  
  

  for (let index = 0; index < data.length; index++) {
    const e = data[index];
    const tx = await contract.addRealEstate(e.cadastralNumber, hre.ethers.utils.parseEther(e.value), e.date, hre.ethers.utils.parseEther(e.share.toString()));
    console.log('addRealEstate', tx.hash)

    for (const update of e.updates) {
      const tx = await contract.updateRealEstateValue(e.cadastralNumber, hre.ethers.utils.parseEther('5520000'), Date.parse('2022-11-01'));
      await tx.wait();
      console.log('updateRealEstateValue', tx.hash)
    }

    if (e.sold) {
      const tx = await contract.removeRealEstate(e.cadastralNumber, hre.ethers.utils.parseEther(e.soldValue), hre.ethers.utils.parseEther(e.value), e.soldTimestamp, hre.ethers.utils.parseEther(e.share.toString()));
      console.log('removedRealEstate', tx.hash)
    }

  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

