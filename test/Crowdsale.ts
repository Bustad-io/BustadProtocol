import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { BustadToken, Crowdsale } from "../typechain";
import { fromEther, toEther } from "../utils/format";
import { generateWallet, resetTokenBalance } from "./utils/utils";
import { DaiTest } from '../typechain/DaiTest.d';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Wallet } from "ethers";

describe("Crowdsale", () => {
  let bustadToken: BustadToken;  
  let dai: DaiTest;
  let crowdsale: Crowdsale;

  let admin: SignerWithAddress
  let horde: SignerWithAddress

  before(async () => {
    [admin, horde] = await ethers.getSigners();
    await deployments.fixture();        
    
    bustadToken = <BustadToken> await ethers.getContract("BustadToken", admin.address);
    dai = <DaiTest> await ethers.getContract("DaiTest", admin.address);
    crowdsale = <Crowdsale> await ethers.getContract("Crowdsale", admin.address);
  });

  describe("Deployment", () => {
    it("Should have correct rate", async () => {      
      expect(await crowdsale.rate()).to.equal(ethers.constants.WeiPerEther);
    });
    it("Should have correct token", async () => {
      expect(await crowdsale.bustadToken()).to.equal(bustadToken.address);
    });
    it("Should have correct wallet", async () => {
      const { horde } = await getNamedAccounts();
      expect(await crowdsale.wallet()).to.equal(horde);
    });
  });

  describe("Buy with ETH", () => {
    let userWallet: Wallet;
    before(async () => {   
      userWallet = await generateWallet(ethers.provider, 5);
      console.log('userwallet', userWallet.address);

      const _crowdsale = await crowdsale.connect(userWallet);      
      await _crowdsale.buyTokensWithETH({
        value: fromEther(1).toString(),
      });
    });

    it("Buyer should receive correct amount of tokens", async () => {      
      const balance = await bustadToken.balanceOf(userWallet.address);
      expect(Number(toEther(balance))).to.be.equal(970);
    });

    it("Treasury should receive correct amount of ether", async () => {      
      const daiBalance = await dai.balanceOf(horde.address);
      expect(Number(toEther(daiBalance))).to.be.equal(1000);
    });
  });

  describe("Buy with stable coin", () => {
    let userWallet: Wallet;
    before(async () => {    
      /* await transferTotalBalance(horde.signer, mockUser.signer.address, dai.address);
      await resetTokenBalance(mockUser.signer, bustadToken.address); */
      await resetTokenBalance(horde, dai.address);
      userWallet = await generateWallet(ethers.provider, 5);
      console.log('userwallet', userWallet.address);

      const _dai = await dai.connect(userWallet);
      const _crowdsale = await crowdsale.connect(userWallet);

      await _dai.mint(userWallet.address, fromEther(1_000_000));        
      await _dai.approve(_crowdsale.address, fromEther(100));        
      await _crowdsale.buyTokensWithStableCoin(fromEther(100), _dai.address);
    });

    it("Buyer should receive correct amount of tokens", async () => {            
      const balance = await bustadToken.balanceOf(userWallet.address);
      expect(Number(toEther(balance))).to.equal(97);
    });

    it("Treasury should receive correct amount of dai", async () => {      
      const daiBalance = await dai.balanceOf(horde.address);
      expect(Number(toEther(daiBalance))).to.equal(100);
    });
  });

  describe("Rate", () => {
    let userWallet: Wallet;
    before(async () => {      
      await crowdsale.setRate(fromEther(10));
      userWallet = await generateWallet(ethers.provider, 5);
      console.log('userwallet', userWallet.address);
    });    

    it("Should mint correct number of tokens with new rate when buying with ETH", async () => {
      const _crowdsale = await crowdsale.connect(userWallet);
      await _crowdsale.buyTokensWithETH({
        value: fromEther(1).toString(),
      });

      const balance = await bustadToken.balanceOf(userWallet.address);
      expect(Number(toEther(balance))).to.equal(9700);
    });        

    it("Should mint correct number of tokens with new rate when buying with stable coin", async () => {
      const _dai = await dai.connect(userWallet);
      const _crowdsale = await crowdsale.connect(userWallet);

      await resetTokenBalance(userWallet, bustadToken.address);

      await _dai.mint(userWallet.address, fromEther(1_000_000));        
      await _dai.approve(_crowdsale.address, fromEther(100));              
      
      await _crowdsale.buyTokensWithStableCoin(fromEther(100), dai.address);

      const balance = await bustadToken.balanceOf(userWallet.address);
      expect(Number(toEther(balance))).to.equal(970);
    });
  });
});
