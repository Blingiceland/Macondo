import type { Metadata } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import { Macondo as MacondoFont } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })
const macondoFont = MacondoFont({ weight: '400', subsets: ['latin'], variable: '--font-macondo-gf' })

export const metadata: Metadata = {
  title: 'Macondo — Bar & Spirits',
  description: 'A place that exists between memory and dream. Cocktails, tequila, and the spirit of magical realism.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} ${macondoFont.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
