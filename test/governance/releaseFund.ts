import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { fromEther, parseToNumber, toEther } from "../../utils/format";
import { BustadToken, GovernanceToken, ReleaseFund } from "../../typechain";
import {  
  RELEASE_FUND_BALANCE,
  TEST_USER_GOV_TOKEN_AMOUNT,  
} from "../../helper-hardhat-config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Wallet } from "ethers";
import { generateWallet } from "../utils/utils";

describe("ReleaseFund", function () {
  let governanceToken: GovernanceToken;
  let bustadtoken: BustadToken;
  let releaseFund: ReleaseFund;
  let admin: SignerWithAddress;
  let userWallet: Wallet;  

  let userGovShare: Number;

  before(async () => {
    [admin] = await ethers.getSigners();    

    await deployments.fixture();

    releaseFund = await ethers.getContract("ReleaseFund", admin);
    governanceToken = await ethers.getContract("GovernanceToken", admin);
    bustadtoken = await ethers.getContract("BustadToken", admin);

    await governanceToken.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SNAPSHOTER_ROLE")),
      admin.address
    );

    await governanceToken.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
      admin.address
    );

    userWallet = await generateWallet(ethers.provider, 5);

    await governanceToken.mint(userWallet.address, fromEther(TEST_USER_GOV_TOKEN_AMOUNT));
  });

  describe("Initialization", () => {    
    before(async () => {      
      const res = await (await governanceToken.snapshot()).wait();
      const snapshotId = Number(res.events![0].args![0]);
      const blockNumber = await ethers.provider.getBlockNumber();

      const userGovAmount = parseToNumber(await governanceToken.balanceOfAt(userWallet.address, snapshotId));
      const totalGovSupply = parseToNumber(await governanceToken.totalSupplyAt(snapshotId));

      userGovShare = userGovAmount / totalGovSupply;      

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
      expect(await bustadtoken.balanceOf(releaseFund.address)).to.equal(
        fromEther(RELEASE_FUND_BALANCE)
      );
    });
  });

  describe("Withdraw", async () => {
    it("user should withdraw and have correct balance", async () => {
      await (await releaseFund.connect(userWallet)).withdraw();

      const balance = await bustadtoken.balanceOf(userWallet.address);      
      const expected = (Number(userGovShare) * Number(RELEASE_FUND_BALANCE));

      expect(parseToNumber(balance)).to.be.closeTo(expected, 0.00001)
    });
    it("should have correct fund balance", async () => {
      const userBalance = await bustadtoken.balanceOf(userWallet.address);      
      const releaseFundBalance = await bustadtoken.balanceOf(releaseFund.address);
      expect(parseToNumber(releaseFundBalance)).to.be.closeTo(
        RELEASE_FUND_BALANCE - parseToNumber(userBalance), 0.00001
      );
    });
    it("should have correct user balance", async () => {      
      const userBalance = await bustadtoken.balanceOf(userWallet.address);
      expect(parseToNumber(userBalance)).to.be.closeTo(
        Number(userGovShare) * Number(RELEASE_FUND_BALANCE), 0.00001
      );
    });

    it("should throw error: <Has already withdrawn funds>", async () => {      
      const releasefundTemp = await releaseFund.connect(userWallet);

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
