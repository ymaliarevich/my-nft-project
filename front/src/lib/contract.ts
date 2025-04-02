import { ethers } from 'ethers'

const CONTRACT_ADDRESS = '0xE5A1AD65436D9Fd28B106ca0ed88BF06D22B4380'
import MyNFTJson from '../../../blockchain/artifacts/contracts/MyNFT.sol/MyNFT.json'

export function getContract(providerOrSigner: ethers.Provider | ethers.Signer) {
    return new ethers.Contract(CONTRACT_ADDRESS, MyNFTJson.abi, providerOrSigner)
}
