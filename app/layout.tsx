// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Cairo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const cairo = Cairo({ 
  subsets: ["latin", "arabic"],
  variable: '--font-cairo',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#c9a96e',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://lucky-wheel-kappa.vercel.app'),
  title: {
    default: 'SHEIN Spin Tunisia | العجلة الدوارة لربح قسائم SHEIN في تونس',
    template: '%s | SHEIN Spin Tunisia'
  },
  description: 'لعبة العجلة الدوارة لربح قسائم شراء من SHEIN (SHEIN) في تونس. دوري العجلة واربحي جوائز تصل إلى 500 دينار. عروض حصرية للمتسوقات التونسيات.',
  keywords: ['SHEIN تونس', 'عجلة الحظ', 'قسائم شراء', 'تخفيضات SHEIN', 'ربح المال', 'تسوق أونلاين تونس', 'جوائز يومية'],
  authors: [{ name: 'SHEIN Spin Tunisia' }],
  creator: 'SHEIN Spin Tunisia',
  publisher: 'SHEIN Spin Tunisia',
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_TN',
    url: 'https://lucky-wheel-kappa.vercel.app',
    siteName: 'SHEIN Spin Tunisia',
    title: 'SHEIN Spin Tunisia | العجلة الدوارة لربح قسائم SHEIN',
    description: 'لعبة العجلة الدوارة لربح قسائم شراء من SHEIN في تونس. دوري العجلة واربحي جوائز تصل إلى 500 دينار.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SHEIN Spin Tunisia - Lucky Wheel Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHEIN Spin Tunisia | العجلة الدوارة لربح قسائم SHEIN',
    description: 'لعبة العجلة الدوارة لربح قسائم شراء من SHEIN في تونس. دوري العجلة واربحي جوائز تصل إلى 500 دينار.',
    images: ['/og-image.jpg'],
    creator: '@sheinspin',
    site: '@sheinspin',
  },
  alternates: {
    canonical: 'https://lucky-wheel-kappa.vercel.app',
    languages: {
      'ar-TN': 'https://lucky-wheel-kappa.vercel.app',
      'en-US': 'https://lucky-wheel-kappa.vercel.app/en',
    },
  },
  category: 'entertainment',
  classification: 'Online Game, Shopping Rewards',
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console code
  },
  appleWebApp: {
    capable: true,
    title: 'SHEIN Spin',
    statusBarStyle: 'black-translucent',
  },
  applicationName: 'SHEIN Spin Tunisia',
  referrer: 'origin-when-cross-origin',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" className={`${playfair.variable} ${cairo.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="msapplication-TileColor" content="#c9a96e" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="font-sans bg-[#f7f2ed] antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        
        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SHEIN Spin Tunisia",
              "url": "https://lucky-wheel-kappa.vercel.app",
              "logo": "https://lucky-wheel-kappa.vercel.app/icon.svg",
              "sameAs": [
                "https://facebook.com/sheinspin",
                "https://instagram.com/sheinspin",
                "https://twitter.com/sheinspin"
              ],
              "description": "منصة ترفيهية تقدم عجلة حظ لربح قسائم شراء من SHEIN في تونس",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "TN"
              }
            })
          }}
        />
        
        {/* JSON-LD Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SHEIN Spin Tunisia",
              "url": "https://lucky-wheel-kappa.vercel.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://lucky-wheel-kappa.vercel.app/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  );
}