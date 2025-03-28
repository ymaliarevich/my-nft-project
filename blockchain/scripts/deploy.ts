import { ethers } from "hardhat"

async function main() {
    const MyNFT = await ethers.getContractFactory("MyNFT")
    const myNFT = await MyNFT.deploy()
    await myNFT.waitForDeployment()

    console.log("Contract deployed: ", await myNFT.getAddress())
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
