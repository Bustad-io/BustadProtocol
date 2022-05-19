import { expect } from "chai";
import { ethers } from "hardhat";
import { GovernanceToken } from "../typechain";
import { fromEther } from "../utils/format";
import { generateAddress } from "./utils/utils";
import { AccountContractSetupType, setupTestFactory } from "./utils/setup";
import { GovernanceDistributor } from '../typechain/GovernanceDistributor.d';
import { TOTAL_GOV_TOKEN_DISTRIBUTION_AMOUNT } from "../helper-hardhat-config";
import { moveTime } from "../utils/move-blocks";
import { Wallet } from "ethers";

describe("GovernanceDistributor", () => {
  let admin: AccountContractSetupType<GovernanceDistributor>
  let governanceToken: GovernanceToken  

  before(async () => {
    const signers = await ethers.getSigners();

    const setupTest = setupTestFactory<GovernanceDistributor>('GovernanceDistributor', {
      admin: signers[0], 
      horde: signers[1], 
      mockUser: signers[2]      
    });
    
    ({admin} = await setupTest());

    governanceToken = <GovernanceToken> await ethers.getContract("GovernanceToken", admin.signer.address);

    await (
      await governanceToken.transfer(
        admin.contract.address,
        fromEther(TOTAL_GOV_TOKEN_DISTRIBUTION_AMOUNT)
        )
        ).wait();        

    await admin.contract.setAmountLeftToDistribute(fromEther(TOTAL_GOV_TOKEN_DISTRIBUTION_AMOUNT));
  });

  describe("Add buyer, Ratio=1", () => {
    let userWallet: Wallet;
    before(async () => {
      userWallet = generateAddress();
      await admin.contract.addBuyer(userWallet.address ,fromEther(100_000));      
    });
    it("Ratio should be correct", async () => {                
      const ratio = await admin.contract.bustadToGovDistributionRatio();      
      expect(ratio).to.equal(fromEther(1));      
    });    
    it("User should be registered with correct amount of shares", async () => {                
      const govTokenAmount = await admin.contract.getGovTokenShareForUser(userWallet.address);
      expect(govTokenAmount).to.equal(fromEther(100_000));      
    });    
  });

  for (let i = 1; i <= 10; i++) {
    const exptectedRatio = 1/Math.pow(2,i);
    describe(`Add buyer, Ratio=${exptectedRatio}`, () => {
      let userWallet: Wallet;
      before(async () => {      
        userWallet = generateAddress();
        await moveTime(7776001); //Seconds in 90 days            
        await admin.contract.addBuyer(userWallet.address ,fromEther(100_000));                  
      });
      it("Ratio should be correct", async () => {
        const actualRatio = await admin.contract.bustadToGovDistributionRatio();        
        expect(actualRatio).to.equal(fromEther(exptectedRatio));      
      });    
      it("User should be registered with correct amount of shares", async () => {                
        const govTokenAmount = await admin.contract.getGovTokenShareForUser(userWallet.address);      
        expect(govTokenAmount).to.equal(fromEther(100_000 * exptectedRatio));      
      });    
    });
  }  
});
