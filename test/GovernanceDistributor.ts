import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { GovernanceToken } from "../typechain";
import { fromEther } from "../utils/format";
import { generateWallet } from "./utils/utils";
import { GovernanceDistributor } from '../typechain/GovernanceDistributor.d';
import { TOTAL_GOV_TOKEN_DISTRIBUTION_AMOUNT } from "../helper-hardhat-config";
import { moveTime } from "../utils/move-blocks";
import { Wallet } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("GovernanceDistributor", () => {
  let admin: SignerWithAddress
  let governanceToken: GovernanceToken
  let governanceDistributor: GovernanceDistributor  

  before(async () => {
    const [admin] = await ethers.getSigners();
    await deployments.fixture(["GovernanceToken", "GovernanceDistributor"]);        

    governanceToken = <GovernanceToken> await ethers.getContract("GovernanceToken", admin);
    governanceDistributor = <GovernanceDistributor> await ethers.getContract("GovernanceDistributor", admin);

    await (
      await governanceToken.transfer(
        governanceDistributor.address,
        fromEther(TOTAL_GOV_TOKEN_DISTRIBUTION_AMOUNT)
        )
        ).wait();        

    await governanceDistributor.setAmountLeftToDistribute(fromEther(TOTAL_GOV_TOKEN_DISTRIBUTION_AMOUNT));
  });

  for (let i = 0; i <= 10; i++) {
    const exptectedRatio = 1/Math.pow(2,i);
    describe(`Add buyer, Ratio=${exptectedRatio}`, () => {
      const buyAmount: number = 100_000;
      let userWallet: Wallet;
      before(async () => {      
        userWallet = await generateWallet(ethers.provider, 5);
        if(i > 0) 
          await moveTime(7776001); //Seconds in 90 days            
        await governanceDistributor.addBuyer(userWallet.address ,fromEther(buyAmount));                  
      });
      it("Ratio should be correct", async () => {
        const actualRatio = await governanceDistributor.bustadToGovDistributionRatio();        
        expect(actualRatio).to.equal(fromEther(exptectedRatio));      
      });    
      it("User should be registered with correct amount of shares", async () => {                
        const govTokenAmount = await governanceDistributor.getGovTokenShareForUser(userWallet.address);      
        expect(govTokenAmount).to.equal(fromEther(buyAmount * exptectedRatio));      
      });
      it("User withdraw correct amount", async () => {                
        const contract = await governanceDistributor.connect(userWallet);      
        await contract.withdraw();
  
        const govTokenBalance = await governanceToken.balanceOf(userWallet.address);
        expect(govTokenBalance).to.equal(fromEther(buyAmount * exptectedRatio));      
      });    
    });
  }  
});
