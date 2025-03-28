'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname()

    const linkStyle = (path: string) =>
        `px-4 py-2 rounded transition ${
            pathname === path ? 'bg-white text-black font-bold' : 'text-white hover:bg-white hover:text-black'
        }`

    return (
        <nav className="w-full bg-black p-4 flex gap-4 justify-center shadow-md">
            <Link href="/" className={linkStyle('/')}>Home</Link>
            <Link href="/mint" className={linkStyle('/mint')}>Mint</Link>
            <Link href="/my-nft" className={linkStyle('/my-nft')}>My NFTs</Link>
        </nav>
    )
}
