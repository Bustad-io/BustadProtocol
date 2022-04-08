import { TokenFeeType } from "../../constants/TokenFeeType";

export function calculateMintingFee(mintingAmount: number, feeAmount: number, mintingFeeType: TokenFeeType) {
    return mintingFeeType === TokenFeeType.Fixed 
        ? mintingAmount - feeAmount 
        : mintingAmount * feeAmount;
}