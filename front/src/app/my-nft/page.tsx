'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { getContract } from '@/lib/contract'
import './my-nft.css'

type NFTData = {
    tokenId: number
    image: string
    name: string
    description: string
}

export default function MyNFTPage() {
    const [wallet, setWallet] = useState<string | null>(null)
    const [nfts, setNfts] = useState<NFTData[]>([])
    const [loading, setLoading] = useState(false)

    async function connectWallet() {
        if (!window.ethereum) return

        const accounts = (await window.ethereum.request({
            method: 'eth_requestAccounts',
        })) as string[]

        if (!accounts.length) return
        setWallet(accounts[0])
        localStorage.setItem('wallet', accounts[0])
    }

    async function loadMyNFTs() {
        if (!window.ethereum || !wallet) return

        setLoading(true)
        setNfts([])

        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = getContract(provider)

        const balance = await contract.balanceOf(wallet)
        const nftList: NFTData[] = []

        for (let i = 0; i < balance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(wallet, i)
            const uri = await contract.tokenURI(tokenId)
            const metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
            const metadata = await fetch(metadataUrl).then(res => res.json())
            const image = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')

            nftList.push({
                tokenId: Number(tokenId),
                image,
                name: metadata.name || `NFT #${tokenId}`,
                description: metadata.description || '',
            })
        }

        setNfts(nftList)
        setLoading(false)
    }

    useEffect(() => {
        async function restoreWallet() {
            if (!window.ethereum) return

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

    useEffect(() => {
        if (wallet) loadMyNFTs()
    }, [wallet])

    return (
        <main className="container">
            <h1 className="title">🖼 Мои NFT</h1>

            {!wallet ? (
                <button onClick={connectWallet}>Setup Metamask</button>
            ) : loading ? (
                <p>Загружаю NFT...</p>
            ) : (
                <div className="grid">
                    {nfts.map((nft) => (
                        <div className="card" key={nft.tokenId}>
                            <img src={nft.image} alt={nft.name} className="nft-image" />
                            <div className="nft-info">
                                <h3>{nft.name}</h3>
                                <p>{nft.description}</p>
                                <span className="token-id">Token ID: {nft.tokenId}</span>
                            </div>
                        </div>
                    ))}
                    {nfts.length === 0 && <p>You dont have NFT</p>}
                </div>
            )}
        </main>
    )
}
