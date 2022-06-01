import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { BustadToken, Crowdsale } from "../typechain";
import { fromEther, toEther } from "../utils/format";
import { generateWallet, resetTokenBalance } from "./utils/utils";
import { DaiTest } from '../typechain/DaiTest.d';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Wallet } from "ethers";
import { ETH_PRICE, TOKEN_MINTING_FEE } from "../helper-hardhat-config";

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
      expect(await crowdsale.bustadWallet()).to.equal(horde);
    });
  });

  describe("Buy with ETH", () => {
    let userWallet: Wallet;
    let bustadWallet: Wallet;
    before(async () => {   
      userWallet = await generateWallet(ethers.provider, 5);      
      bustadWallet = await generateWallet(ethers.provider);
      
      await crowdsale.setBustadWallet(bustadWallet.address);

      const _crowdsale = await crowdsale.connect(userWallet);      
      await _crowdsale.buyWithETH({
        value: fromEther(1).toString(),
      });
    });

    it("Buyer should receive correct amount of tokens", async () => {      
      const balance = await bustadToken.balanceOf(userWallet.address);
      expect(Number(toEther(balance))).to.be.equal(1952.41 - (1952.41 * TOKEN_MINTING_FEE));
    });

    it("Bustad wallet should receive correct amount of ether", async () => {      
      const ethBalance = await ethers.provider.getBalance(bustadWallet.address);
      expect(Number(toEther(ethBalance))).to.be.equal(1);
    });
  });

  describe("Buy with stable coin", () => {
    let userWallet: Wallet;
    let bustadWallet: Wallet;
    
    before(async () => {          
      userWallet = await generateWallet(ethers.provider, 5);      
      bustadWallet = await generateWallet(ethers.provider);

      await crowdsale.setBustadWallet(bustadWallet.address);

      const _dai = await dai.connect(userWallet);
      const _crowdsale = await crowdsale.connect(userWallet);

      await _dai.mint(userWallet.address, fromEther(1_000));        
      await _dai.approve(_crowdsale.address, fromEther(1_000));      
      await _crowdsale.buyWithStableCoin(fromEther(1_000), _dai.address);
    });

    it("Buyer should receive correct amount of tokens", async () => {            
      const balance = await bustadToken.balanceOf(userWallet.address);
      expect(Number(toEther(balance))).to.equal(970);
    });

    it("Bustad wallet should receive correct amount of dai", async () => {      
      const daiBalance = await dai.balanceOf(bustadWallet.address);
      expect(Number(toEther(daiBalance))).to.equal(1_000);
    });
  });

  describe("Rate", () => {
    let userWallet: Wallet;
    const newRate = .1;

    before(async () => {      
      await crowdsale.setRate(fromEther(newRate));
      userWallet = await generateWallet(ethers.provider, 5);      
    });    

    it("Should mint correct number of tokens with new rate when buying with ETH", async () => {
      const _crowdsale = await crowdsale.connect(userWallet);
      await _crowdsale.buyWithETH({
        value: fromEther(1).toString(),
      });

      const balance = await bustadToken.balanceOf(userWallet.address);    
      expect(Number(toEther(balance)).toString()).to.be.equal(Number((ETH_PRICE - (ETH_PRICE * TOKEN_MINTING_FEE)) * newRate).toPrecision(8).toString());
    });
    

    it("Should mint correct number of tokens with new rate when buying with stable coin", async () => {
      const _dai = await dai.connect(userWallet);
      const _crowdsale = await crowdsale.connect(userWallet);

      await resetTokenBalance(userWallet, bustadToken.address);

      await _dai.mint(userWallet.address, fromEther(1_000));        
      await _dai.approve(_crowdsale.address, fromEther(1_000));              
      
      await _crowdsale.buyWithStableCoin(fromEther(1_000), dai.address);

      const balance = await bustadToken.balanceOf(userWallet.address);
      expect(Number(toEther(balance))).to.equal(97);
    });
  });

  describe("Paused", () => {
    let userWallet: Wallet;
    before(async () => {
      userWallet = await generateWallet(ethers.provider, 5);      

      await crowdsale.grantRole(
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PAUSER_ROLE")),
        admin.address
      );
      await crowdsale.pause();
    });    

    it("Should not be able buy with ETH", async () => {
      const _crowdsale = await crowdsale.connect(userWallet);    
      
      await expect(_crowdsale.buyWithETH({
        value: fromEther(1).toString(),
      })).to.be.revertedWith(
        "Pausable: paused"
      );
    });            

    it("Should not be able buy with stable coin", async () => {
      const _crowdsale = await crowdsale.connect(userWallet);    
      
      await expect(_crowdsale.buyWithStableCoin(fromEther(100), dai.address)).to.be.revertedWith(
        "Pausable: paused"
      );
    });            
  });
});
