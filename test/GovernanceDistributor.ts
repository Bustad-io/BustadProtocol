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

const addBuyerScenarios = [
  {
    buyAmount: 10_000_000,
    expectedRatio: 1
  },
  {
    buyAmount: 20_000_000,
    expectedRatio: 1
  },
  {
    buyAmount: 25_000_000,
    expectedRatio: 1
  },
  {
    buyAmount: 45_000_000,
    expectedRatio: .5
  },
  {
    buyAmount: 30_000_000,
    expectedRatio: .25
  },
  {
    buyAmount: 20_000_000,
    expectedRatio: .25
  },
  {
    buyAmount: 15_000_000,
    expectedRatio: .125
  },
  {
    buyAmount: 10_000_000,
    expectedRatio: .125
  },
  {
    buyAmount: 30_000_000,
    expectedRatio: .125
  },  
  {
    buyAmount: 30_000_000,
    expectedRatio: .0625
  }
]

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

  addBuyerScenarios.forEach(scenario => {
    describe(`Add buyer, Ratio=${scenario.expectedRatio}`, () => {
      const buyAmount: number = scenario.buyAmount;
      const exptectedRatio = scenario.expectedRatio;
      let userWallet: Wallet;
      
      before(async () => {      
        userWallet = await generateWallet(ethers.provider, 5);           
        await governanceDistributor.addBuyer(userWallet.address ,fromEther(buyAmount));                  
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
  })
});
