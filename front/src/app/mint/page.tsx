'use client'

import { useEffect, useState } from 'react'
import { ethers, Log } from 'ethers'
import { getContract } from '@/lib/contract'
import './mint.css'

type NFTData = {
    tokenId: number
    image: string
    name: string
    description: string
}

export default function MintPage() {
    const [wallet, setWallet] = useState<string | null>(null)
    const [status, setStatus] = useState('')
    const [nft, setNft] = useState<NFTData | null>(null)

    async function connectWallet() {
        if (typeof window === 'undefined' || !window.ethereum) return

        const accounts = (await window.ethereum.request({
            method: 'eth_requestAccounts',
        })) as string[]

        if (!accounts.length) return
        setWallet(accounts[0])
        localStorage.setItem('wallet', accounts[0])
    }

    async function handleMint() {
        if (!window.ethereum || !wallet) return

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = getContract(signer)

        try {
            setStatus('Minting...')
            const tx = await contract.safeMintTo(wallet)
            const receipt = await tx.wait()

            const transferLog = receipt.logs.find((log: Log) =>
                log.topics[0] === ethers.id('Transfer(address,address,uint256)')
            )

            if (!transferLog) throw new Error('Transfer event not found')
            const tokenId = Number(BigInt(transferLog.topics[3]))

            const tokenUri = await contract.tokenURI(tokenId)
            const metadataUrl = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
            const metadata = await fetch(metadataUrl).then((res) => res.json())
            const image = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')

            setNft({
                tokenId,
                image,
                name: metadata.name || `NFT #${tokenId}`,
                description: metadata.description || '',
            })

            setStatus('Mint finished')
        } catch (err) {
            console.error(err)
            setStatus('Mint failed')
        }
    }

    useEffect(() => {
        async function restoreWallet() {
            if (typeof window === 'undefined' || !window.ethereum) return

            const saved = localStorage.getItem('wallet')
            if (saved) setWallet(saved)

            const provider = new ethers.BrowserProvider(window.ethereum)
            const accounts = await provider.send('eth_accounts', [])
            if (accounts.length > 0) {
                setWallet(accounts[0])
                localStorage.setItem('wallet', accounts[0])
            }
        }

        restoreWallet()
    }, [])

    return (
        <main className="container">
            <h1 className="title">Mint NFT</h1>

            {!wallet ? (
                <button onClick={connectWallet}>Setup Metamask</button>
            ) : (
                <>
                    <p className="wallet">Wallet: {wallet}</p>
                    <button onClick={handleMint}>🎨 Mint NFT</button>
                    <p className="status">{status}</p>

                    {nft && (
                        <div className="card">
                            <img src={nft.image} alt={nft.name} className="nft-image" />
                            <div className="nft-info">
                                <h3>{nft.name}</h3>
                                <p>{nft.description}</p>
                                <span className="token-id">Token ID: {nft.tokenId}</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </main>
    )
}
