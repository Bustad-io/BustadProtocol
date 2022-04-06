import { expect } from "chai";
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

describe("BustadToken", function () {
  let bustadToken: BustadToken;
  let admin: string;

  beforeEach(async () => {
    ({ admin } = await getNamedAccounts());

    await deployments.fixture(["BustadToken"]);
    bustadToken = await ethers.getContract("BustadToken", admin);
  });

  describe("Deployment", function() {
    it("Should get correct initial parameters", async function () {
      expect(await bustadToken.name()).to.equal(TOKEN_NAME);
      expect(await bustadToken.symbol()).to.equal(TOKEN_SYMBOL);
      expect(await bustadToken.decimals()).to.equal(TOKEN_DECIMALS);
      expect(await bustadToken.totalSupply()).to.equal(
        fromEther(INITIAL_TOKEN_AMOUNT)
      );
    });
    it("Should mint correct initial supply to admin", async function() {
      const adminBalance = await bustadToken.balanceOf(admin);
      expect(adminBalance).to.equal(fromEther(INITIAL_TOKEN_AMOUNT));
    });
  });

  describe("Minting", function() {
    it("Should mint correct amount to beneficiary", async () => {
      const { admin, mockUser } = await getNamedAccounts();
  
      await bustadToken.grantRole(
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
        admin
      );
      await bustadToken.mint(mockUser, fromEther(1));
      const balance = await bustadToken.balanceOf(mockUser);
      expect(Number(toEther(balance))).to.equal(1 - TOKEN_MINTING_FEE);
    });
  
    it("Should transfer correct amount to beneficiary", async () => {
      const { mockUser } = await getNamedAccounts();
  
      await bustadToken.transfer(mockUser, fromEther(1));
      const balance = await bustadToken.balanceOf(mockUser);
      expect(Number(toEther(balance))).to.equal(1 - TOKEN_TRANSFER_FEE);
    });
  })
});
