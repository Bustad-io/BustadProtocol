import { expect } from "chai";
import { Signer } from "ethers";
import { ethers, getNamedAccounts, deployments } from "hardhat";
import { BustadToken, Crowdsale, Dai, IERC20 } from "../typechain";
import { fromEther, toEther } from "../utils/format";
import { getExternalContract } from "../utils/helpers";
import { resetTokenBalance, transferTotalBalance } from "./utils/utils";
import { ERC20 } from '../typechain/ERC20.d';
import { DaiTest } from '../typechain/DaiTest.d';
import { AccountContractSetupType, setupTestFactory } from "./utils/setup";

describe("Crowdsale", () => {
  let bustadToken: BustadToken;  
  let dai: DaiTest;

  let admin: AccountContractSetupType<Crowdsale>
  let horde: AccountContractSetupType<Crowdsale>
  let mockUser: AccountContractSetupType<Crowdsale>

  before(async () => {
    const signers = await ethers.getSigners();

    const setupTest = setupTestFactory<Crowdsale>('Crowdsale', {
      admin: signers[0], 
      horde: signers[1], 
      mockUser: signers[2]
    });
    
    ({admin, horde, mockUser} = await setupTest());    
    
    bustadToken = <BustadToken> await ethers.getContract("BustadToken", admin.signer.address);
    dai = <DaiTest> await ethers.getContract("DaiTest", admin.signer.address);
  });

  describe("Deployment", () => {
    it("Should have correct rate", async () => {      
      expect(await admin.contract.rate()).to.equal(ethers.constants.WeiPerEther);
    });
    it("Should have correct token", async () => {
      expect(await admin.contract.bustadToken()).to.equal(bustadToken.address);
    });
    it("Should have correct wallet", async () => {
      const { horde } = await getNamedAccounts();
      expect(await admin.contract.wallet()).to.equal(horde);
    });
  });

  describe("Buy with ETH", () => {
    before(async () => {            
      await mockUser.contract.buyTokensWithETH({
        value: fromEther(1).toString(),
      });
    });

    it("Buyer should receive correct amount of tokens", async () => {
      const { mockUser } = await getNamedAccounts();
      const balance = await bustadToken.balanceOf(mockUser);
      expect(Number(toEther(balance))).to.be.equal(970);
    });

    it("Treasury should receive correct amount of ether", async () => {
      const { horde } = await getNamedAccounts();
      const daiBalance = await dai.balanceOf(horde);
      expect(Number(toEther(daiBalance))).to.be.equal(1000);
    });
  });

  describe("Buy with stable coin", () => {
    before(async () => {    
      await transferTotalBalance(horde.signer, mockUser.signer.address, dai.address);
      await resetTokenBalance(mockUser.signer, bustadToken.address);

      const mockUserDai = <DaiTest> await ethers.getContract("DaiTest", mockUser.signer.address);
        
      await mockUserDai.approve(mockUser.contract.address, fromEther(100));
      await mockUser.contract.buyTokensWithStableCoin(fromEther(100), dai.address);
    });

    it("Buyer should receive correct amount of tokens", async () => {      
      const { mockUser } = await getNamedAccounts();
      const balance = await bustadToken.balanceOf(mockUser);
      expect(Number(toEther(balance))).to.equal(97);
    });

    it("Treasury should receive correct amount of dai", async () => {
      const { horde } = await getNamedAccounts();
      const daiBalance = await dai.balanceOf(horde);
      expect(Number(toEther(daiBalance))).to.equal(100);
    });
  });

  describe("Rate", () => {
    before(async () => {      
      await admin.contract.setRate(fromEther(10));
    });

    beforeEach(async () => {
      await resetTokenBalance(mockUser.signer, bustadToken.address);      
    });

    it("Should mint correct number of tokens with new rate when buying with ETH", async () => {      
      await mockUser.contract.buyTokensWithETH({
        value: fromEther(1).toString(),
      });

      const balance = await bustadToken.balanceOf(mockUser.signer.address);
      expect(Number(toEther(balance))).to.equal(9700);
    });    

    it("Should mint correct number of tokens with new rate when buying with stable coin", async () => {
      const mockUserDai = <DaiTest> await ethers.getContract("DaiTest", mockUser.signer.address);        
      await mockUserDai.approve(mockUser.contract.address, fromEther(100));      
      await mockUser.contract.buyTokensWithStableCoin(fromEther(100), dai.address);

      const balance = await bustadToken.balanceOf(mockUser.signer.address);
      expect(Number(toEther(balance))).to.equal(970);
    });
  });
});
