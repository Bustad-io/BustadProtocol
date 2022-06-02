import { expect } from "chai";
import { Wallet } from "ethers";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import {  
  TOKEN_NAME,
  TOKEN_SYMBOL,  
  INITIAL_TOKEN_AMOUNT,
  TOKEN_DECIMALS,
} from "../helper-hardhat-config";
import { BustadToken } from "../typechain";
import { fromEther, toEther } from "../utils/format";
import { generateWallet } from "./utils/utils";

describe("BustadToken", function () {
  let bustadToken: BustadToken;
  let admin: string;

  beforeEach(async () => {
    ({ admin } = await getNamedAccounts());

    await deployments.fixture(["BustadToken"]);
    bustadToken = await ethers.getContract("BustadToken", admin);
  });

  describe("Deployment", function () {
    it("Should get correct initial parameters", async function () {
      expect(await bustadToken.name()).to.equal(TOKEN_NAME);
      expect(await bustadToken.symbol()).to.equal(TOKEN_SYMBOL);
      expect(await bustadToken.decimals()).to.equal(TOKEN_DECIMALS);
      expect(await bustadToken.totalSupply()).to.equal(
        fromEther(INITIAL_TOKEN_AMOUNT)
      );
    });
    it("Should mint correct initial supply to admin", async function () {
      const adminBalance = await bustadToken.balanceOf(admin);
      expect(adminBalance).to.equal(fromEther(INITIAL_TOKEN_AMOUNT));
    });
  });

  describe("Minting", function () {
    let userWallet: Wallet;
    let feeCollector: Wallet;
    beforeEach(async () => {
      userWallet = await generateWallet(ethers.provider);
      feeCollector = await generateWallet(ethers.provider);

      await bustadToken.grantRole(
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MAINTAINER_ROLE")),
        admin
      );

      await bustadToken.setFeeCollector(feeCollector.address);
    });
    it("Should mint correct amount to user", async () => {
      await bustadToken.mint(userWallet.address, fromEther(1));

      const userBalance = await bustadToken.balanceOf(userWallet.address);
      expect(userBalance).to.equal(fromEther(1));      
    });

    it("Should transfer correct amount to user", async () => {
      await bustadToken.transfer(userWallet.address, fromEther(1));

      const userBalance = await bustadToken.balanceOf(userWallet.address);
      expect(userBalance).to.equal(fromEther(1));      
    });

    describe("Pause minting", () => {
      beforeEach(async () => {
        await bustadToken.grantRole(
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PAUSER_ROLE")),
          admin
        );
        await bustadToken.pause();
      });
      it("Should not be able to mint", async () => {
        await expect(bustadToken.mint(userWallet.address, fromEther(1))).to.be.revertedWith(
          "Pausable: paused"
        );
      })
    });
  })

  describe("Burning", () => {
    let userWallet: Wallet;
    const AMOUNT_TO_MINT = 1;
    beforeEach(async () => {
      userWallet = await generateWallet(ethers.provider, 10);      
      await bustadToken.mint(userWallet.address, fromEther(AMOUNT_TO_MINT));      
    });

    it("Should have correct balance and totalsupply after burning", async () => {
      const userBalanceBeforeBurn = await bustadToken.balanceOf(userWallet.address);
      expect(userBalanceBeforeBurn).to.equal(fromEther(AMOUNT_TO_MINT));

      const totalsupplyBeforeBurn = await bustadToken.totalSupply();
      expect(totalsupplyBeforeBurn).to.equal(fromEther(INITIAL_TOKEN_AMOUNT + AMOUNT_TO_MINT));

      bustadToken = await ethers.getContract("BustadToken", userWallet);

      const AMOUNT_TO_BURN = userBalanceBeforeBurn;
      await bustadToken.burn(userBalanceBeforeBurn);

      const userBalanceAfterBurn = await bustadToken.balanceOf(userWallet.address);
      expect(userBalanceAfterBurn).to.equal(0);

      const totalsupplyAfterBurn = await bustadToken.totalSupply();      
      
      expect(Number(toEther(totalsupplyAfterBurn))).to.equal(Number(toEther(totalsupplyBeforeBurn)) - Number(toEther((AMOUNT_TO_BURN))));
    });
  })
});
