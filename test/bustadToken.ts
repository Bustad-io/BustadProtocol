import { expect } from "chai";
import { Wallet } from "ethers";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import {
  TOKEN_MINTING_FEE,
  TOKEN_NAME,
  TOKEN_SYMBOL,
  TOKEN_TRANSFER_FEE,
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
    it("Should mint correct amount to user and feeCollector", async () => {
      await bustadToken.mint(userWallet.address, fromEther(1));

      const userBalance = await bustadToken.balanceOf(userWallet.address);
      expect(userBalance).to.equal(fromEther(1 - TOKEN_MINTING_FEE));

      const feeCollectorbalance = await bustadToken.balanceOf(feeCollector.address);
      expect(feeCollectorbalance).to.equal(fromEther(TOKEN_MINTING_FEE));
    });

    it("Should transfer correct amount to user and feeCollector", async () => {
      await bustadToken.transfer(userWallet.address, fromEther(1));

      const userBalance = await bustadToken.balanceOf(userWallet.address);
      expect(userBalance).to.equal(fromEther(1 - TOKEN_TRANSFER_FEE));

      const feeCollectorbalance = await bustadToken.balanceOf(feeCollector.address);
      expect(feeCollectorbalance).to.equal(fromEther(TOKEN_TRANSFER_FEE));
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
});
