import { ethers } from 'ethers'

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
import MyNFTJson from '../../../blockchain/artifacts/contracts/MyNFT.sol/MyNFT.json'

export function getContract(providerOrSigner: ethers.Provider | ethers.Signer) {
    return new ethers.Contract(CONTRACT_ADDRESS, MyNFTJson.abi, providerOrSigner)
}
