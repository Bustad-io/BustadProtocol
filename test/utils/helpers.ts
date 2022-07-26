import { TokenFeeType } from "../../constants/TokenFeeType";
import { splitSignature } from 'ethers/lib/utils'
import { Wallet, constants, BigNumberish, Signature } from "ethers";
import { ERC20Permit } from '../../typechain/ERC20Permit.d';

export function calculateMintingFee(mintingAmount: number, feeAmount: number, mintingFeeType: TokenFeeType) {
    return mintingFeeType === TokenFeeType.Fixed 
        ? mintingAmount - feeAmount 
        : mintingAmount * feeAmount;
}

export async function getPermitSignature(
    wallet: Wallet,
    token: ERC20Permit,
    spender: string,
    value: BigNumberish = constants.MaxUint256,
    deadline = constants.MaxUint256
  ): Promise<Signature> {
    const [nonce, name, version, chainId] = await Promise.all([
      token.nonces(wallet.address),
      token.name(),
      '1',
      wallet.getChainId(),
    ])
  
    return splitSignature(
      await wallet._signTypedData(
        {
          name,
          version,
          chainId,
          verifyingContract: token.address,
        },
        {
          Permit: [
            {
              name: 'owner',
              type: 'address',
            },
            {
              name: 'spender',
              type: 'address',
            },
            {
              name: 'value',
              type: 'uint256',
            },
            {
              name: 'nonce',
              type: 'uint256',
            },
            {
              name: 'deadline',
              type: 'uint256',
            },
          ],
        },
        {
          owner: wallet.address,
          spender,
          value,
          nonce,
          deadline,
        }
      )
    )
  }