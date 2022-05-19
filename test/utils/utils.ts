import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Provider } from '@ethersproject/providers';
import { fromEther } from "../../utils/format";

export const resetTokenBalance = async (
  signer: SignerWithAddress,
  tokenAddress: string
) => {
  const Token = await ethers.getContractFactory("ERC20", signer);
  const token = await Token.attach(tokenAddress);

  const randomReceiver = ethers.Wallet.createRandom();

  const balance = await token.balanceOf(signer.address);
  const tx = await token.transfer(randomReceiver.address, balance);
  await tx.wait(1);
};

export const transferTotalBalance = async (
  from: SignerWithAddress,
  to: string,
  tokenAddress: string
) => {
  const token = await ethers.getContractAt("ERC20", tokenAddress, from);
  const balance = await token.balanceOf(from.address);
  const tx = await token.transfer(to, balance);
  await tx.wait();
};

export const getETHFromMockUser = async (  
  toAddress: string,
  amount: number
) => {
  const [,,mockUser] = await ethers.getSigners();
  await mockUser.sendTransaction({ to: toAddress, value: fromEther(amount)});    
};

export const generateAddress = async (provider?: Provider, initialFund: number = 0) => {
  const wallet = ethers.Wallet.createRandom();

  if(initialFund > 0) {
    await getETHFromMockUser(wallet.address, initialFund);
  }  

  if(provider) {
    return wallet.connect(provider);
  }
  return wallet;
};
