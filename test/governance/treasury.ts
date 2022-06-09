import { expect } from "chai";
import { ethers, getNamedAccounts, deployments } from "hardhat";
import { fromEther, parseToNumber, toEther } from "../../utils/format";
import { BustadToken, Treasury } from "../../typechain";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe("Treasury", function () {
  let bustadtoken: BustadToken;
  let treasury: Treasury;
  let admin: SignerWithAddress;

  const RELEASE_AMOUNT = 100_000;
  const TREASURY_BALANCE = 100_000;

  before(async () => {
    [admin] = await ethers.getSigners();    
    await deployments.fixture();

    treasury = <Treasury> await ethers.getContract("Treasury", admin.address);
    bustadtoken = <BustadToken> await ethers.getContract("BustadToken", admin.address);

    await bustadtoken.mint(treasury.address, fromEther(RELEASE_AMOUNT));    
  });

  describe("Release", async function () {
    it("Should release", async function () {
      await treasury.release(fromEther(RELEASE_AMOUNT));

      const releaseFundAddress =
        await treasury.getCurrentReleaseFundContractAddress();

      expect(await bustadtoken.balanceOf(releaseFundAddress)).to.equal(
        fromEther(RELEASE_AMOUNT)
      );
      expect(await bustadtoken.balanceOf(treasury.address)).to.equal(
        fromEther(TREASURY_BALANCE - RELEASE_AMOUNT)
      );
    });

    it("should set max release amount", async function () {
      await (await treasury.setMaxReleaseAmount(fromEther(100))).wait();
    });

    it("Should throw error: <Amount exceeded limit>", async function () {
      await expect(
        treasury.release(fromEther(RELEASE_AMOUNT))
      ).to.be.revertedWith("Amount exceeded limit");
    });

    it("Should throw error: <Amount exceeded balance>", async function () {
      await (await treasury.setMaxReleaseAmount(fromEther(100_000_000))).wait();
      await expect(treasury.release(fromEther(100_000_000))).to.be.revertedWith(
        "Amount exceeded balance"
      );
    });
  });
});
