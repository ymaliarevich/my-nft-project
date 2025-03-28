import './globals.css' // если ты создаёшь styles внутри app

import type { Metadata } from 'next'
import { ReactNode } from 'react'
import Navbar from '@/app/components/Navbar'

export const metadata: Metadata = {
    title: 'NFT DApp',
    description: 'Mint your NFTs easily',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <head />
        <body>
        <Navbar />
        <main>{children}</main>
        </body>
        </html>
    )
}
