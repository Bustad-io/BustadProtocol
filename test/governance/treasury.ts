import { expect } from "chai";
import { ethers, getNamedAccounts, deployments } from "hardhat";
import { fromEther, toEther } from "../../utils/format";
import { BustadToken, Treasury } from "../../typechain";

describe("Treasury", function () {
  let bustadtoken: BustadToken;
  let treasury: Treasury;

  const RELEASE_AMOUNT = 100_000;
  const TREASURY_BALANCE = 100_000;

  before(async () => {
    const [admin] = await ethers.getSigners();

    const BustadToken = await ethers.getContractFactory("BustadToken", admin);
    const Treasury = await ethers.getContractFactory("Treasury", admin);

    await deployments.fixture();
    const releaseFund = await ethers.getContract("ReleaseFund", admin);
    const governanceToken = await ethers.getContract("GovernanceToken", admin);

    const blockNumber = await ethers.provider.getBlockNumber();

    bustadtoken = <BustadToken>await BustadToken.deploy("", "", fromEther(TREASURY_BALANCE), 0, 0, admin.address, 0, 0);
    treasury = <Treasury>await Treasury.deploy(releaseFund.address, governanceToken.address, bustadtoken.address, blockNumber, blockNumber, fromEther(100_000));

    await bustadtoken.transfer(treasury.address, fromEther(TREASURY_BALANCE));
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
