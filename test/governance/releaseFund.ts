import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { fromEther, toEther } from "../../utils/format";
import { BustadToken, GovernanceToken, ReleaseFund } from "../../typechain";
import { calculateMintingFee } from '../utils/helpers';
import {
  MOCK_USER_GOV_SHARE,
  RELEASE_FUND_BALANCE,
  TOKEN_MINTING_FEE,
  TOKEN_MINTING_TYPE,
  TOKEN_TRANSFER_FEE,
  TOTAL_GOV_TOKEN_AMOUNT,
} from "../../helper-hardhat-config";

describe("ReleaseFund", function () {
  let governanceToken: GovernanceToken;
  let bustadtoken: BustadToken;
  let releaseFund: ReleaseFund;
  let admin: string;
  let mockUser: string;

  before(async () => {
    const namedAccounts = await getNamedAccounts();
    admin = namedAccounts.admin;
    mockUser = namedAccounts.mockUser;

    await deployments.fixture();
    releaseFund = await ethers.getContract("ReleaseFund", admin);
    governanceToken = await ethers.getContract("GovernanceToken", admin);
    bustadtoken = await ethers.getContract("BustadToken", admin);
    
    await (
      await governanceToken.transfer(
        mockUser,
        fromEther(TOTAL_GOV_TOKEN_AMOUNT * MOCK_USER_GOV_SHARE)
        )
        ).wait();        
  });

  describe("Initialization", () => {
    before(async () => {
      const res = await (await governanceToken.snapshot()).wait();
      const snapshotId = Number(res.events![0].args![0]);
      const blockNumber = await ethers.provider.getBlockNumber();

      await bustadtoken.mint(
        releaseFund.address,
        fromEther(RELEASE_FUND_BALANCE)
      );

      await (
        await releaseFund.init(
          snapshotId,
          governanceToken.address,
          bustadtoken.address,
          blockNumber,
          blockNumber
        )
      ).wait();      
    });
    it("should have correct balance", async () => {
      const mintingFee = calculateMintingFee(RELEASE_FUND_BALANCE, TOKEN_MINTING_FEE, TOKEN_MINTING_TYPE);

      expect(await bustadtoken.balanceOf(releaseFund.address)).to.equal(
        fromEther(RELEASE_FUND_BALANCE - mintingFee)
      );
    });
  });

  describe("Withdraw", async () => {
    it("should withdraw", async () => {
      const signers = await ethers.getSigners();
      await (await releaseFund.connect(signers[2])).withdraw();      
    });
    it("should have correct fund balance", async () => {
      const mintingFee = calculateMintingFee(RELEASE_FUND_BALANCE, TOKEN_MINTING_FEE, TOKEN_MINTING_TYPE);

      expect(await bustadtoken.balanceOf(releaseFund.address)).to.equal(
        fromEther(
          RELEASE_FUND_BALANCE - mintingFee - ((RELEASE_FUND_BALANCE - mintingFee) * MOCK_USER_GOV_SHARE)
        )
      );
    });
    it("should have correct user balance", async () => {
      const mintingFee = calculateMintingFee(RELEASE_FUND_BALANCE, TOKEN_MINTING_FEE, TOKEN_MINTING_TYPE);
      expect(await bustadtoken.balanceOf(mockUser)).to.equal(
        fromEther(
          (RELEASE_FUND_BALANCE - mintingFee) * MOCK_USER_GOV_SHARE - TOKEN_TRANSFER_FEE
        )
      );
    });

    it("should throw error: <Has already withdrawn funds>", async () => {
      const signers = await ethers.getSigners();
      const releasefundTemp = await releaseFund.connect(signers[2]);

      await expect(releasefundTemp.withdraw()).to.be.revertedWith(
        "Has already withdrawn funds"
      );
    });
    it("should refund remaining amount", async () => {
      const { events } = await (await releaseFund.refundRemaining()).wait();
      expect(events).to.satisfy((x: Array<Object>) =>
        x.find((e: any) => e.event === "RefundRemaining")
      );
    });

    it("should have correct fund balance after refund", async function () {
      expect(await bustadtoken.balanceOf(releaseFund.address)).to.equal(0);
    });
  });
});
