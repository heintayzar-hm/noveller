import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from './context/client-provider'
import { getSession, getToken } from '../lib/auth'
import axiosInstance from '../axiosInstance'
import { NavbarDefault } from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  const session = await getSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        {
          session?.isLoggedIn && (<NavbarDefault />)
        }
        <Provider session={session}>
          {children}
          </Provider>
      </body>
    </html>
  )
}