import type { Metadata } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import { Macondo as MacondoFont } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })
const macondoFont = MacondoFont({ weight: '400', subsets: ['latin'], variable: '--font-macondo-gf' })

export const metadata: Metadata = {
  title: 'Macondo — Tequila Bar Reykjavík',
  description: 'Kokteilbar í hjarta Reykjavíkur. Handvaldir tequila kokteilar, magískt andrúmsloft og borðbókanir. Veltusund 1, 101 Reykjavík.',
  metadataBase: new URL('https://macondo.is'),
  alternates: {
    canonical: '/',
    languages: {
      'is': '/',
      'en': '/en',
    },
  },
  openGraph: {
    title: 'Macondo — Tequila Bar Reykjavík',
    description: 'Kokteilbar í hjarta Reykjavíkur. Handvaldir tequila kokteilar, magískt andrúmsloft og borðbókanir.',
    url: 'https://macondo.is',
    siteName: 'Macondo Tequila Bar',
    locale: 'is_IS',
    alternateLocale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Macondo — Tequila Bar Reykjavík',
    description: 'Kokteilbar í hjarta Reykjavíkur. Handvaldir tequila kokteilar og borðbókanir.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BarOrPub',
  name: 'Macondo Tequila Bar',
  description: 'Kokteilbar í hjarta Reykjavíkur með handvöldum tequila kokteilum og magískt andrúmsloft.',
  url: 'https://macondo.is',
  email: 'pablo@discobar.is',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Veltusund 1',
    addressLocality: 'Reykjavík',
    postalCode: '101',
    addressCountry: 'IS',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 64.1466,
    longitude: -21.9426,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '16:00',
      closes: '01:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday'],
      opens: '16:00',
      closes: '03:00',
    },
  ],
  sameAs: [
    'https://www.instagram.com/macondo.rvk',
    'https://www.facebook.com/macondo.rvk',
  ],
  servesCuisine: 'Cocktails',
  priceRange: '$$',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="is" style={{ backgroundColor: '#1A0A08' }}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${cinzel.variable} ${macondoFont.variable} antialiased`}
        style={{ backgroundColor: '#1A0A08' }}
      >
        {children}
      </body>
    </html>
  )
}
