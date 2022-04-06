import { deployments } from "hardhat";
import { BaseContract } from 'ethers';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export type AccountContractSetupType<T> = { signer: SignerWithAddress, contract: T };

export type Setup<T> = {
  [key: string]: AccountContractSetupType<T>,  
}

export type NamedSignerType = {[key: string]: SignerWithAddress}

export function setupTestFactory<T extends BaseContract>(contractName: string, signers: NamedSignerType): (options?: any) => Promise<Setup<T>> {
    return deployments.createFixture<Setup<T>, any>(
      async ({deployments, ethers}) => {
        await deployments.fixture();                

        const setup: Setup<T> = {};

        Object.keys(signers)
            .map(async (key, i) => setup[key] = { signer: signers[key], contract: <T> await ethers.getContract(contractName, signers[key]) });
        return setup;
      }
    );
  }