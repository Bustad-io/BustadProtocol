import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import {
  TOKEN_MINTING_FEE,
  TOKEN_NAME,
  TOKEN_SYMBOL,
  TOKEN_TRANSFER_FEE,
  INITIAL_TOKEN_AMOUNT,
} from "../helper-hardhat-config";
import { BustadToken } from "../typechain";
import { fromEther, toEther } from "../utils/format";

describe("BustadToken", function () {
  let bustadToken: BustadToken;

  beforeEach(async () => {
    const { admin } = await getNamedAccounts();

    await deployments.fixture(["BustadToken"]);
    bustadToken = await ethers.getContract("BustadToken", admin);
  });

  it("Should get correct initial parameters", async function () {
    await bustadToken.deployed();

    expect(await bustadToken.name()).to.equal(TOKEN_NAME);
    expect(await bustadToken.symbol()).to.equal(TOKEN_SYMBOL);
    expect(await bustadToken.decimals()).to.equal(18);
    expect(await bustadToken.totalSupply()).to.equal(
      ethers.utils.parseEther(INITIAL_TOKEN_AMOUNT.toString())
    );
  });

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
});
