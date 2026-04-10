import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { SupportChat } from '@/components/support-chat'
import './globals.css'

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter"
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: {
    default: 'QuikMaki — Доставка роллов и пиццы',
    template: '%s | QuikMaki',
  },
  description: 'Доставка свежих суши, роллов и пиццы. Японская и итальянская кухня с доставкой на дом. Бесплатная доставка от 1000₽.',
  keywords: ['суши', 'роллы', 'пицца', 'доставка еды', 'японская кухня', 'итальянская кухня', 'QuikMaki'],
  authors: [{ name: 'QuikMaki' }],
  creator: 'QuikMaki',
  publisher: 'QuikMaki',
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: APP_URL,
    title: 'QuikMaki — Доставка роллов и пиццы',
    description: 'Доставка свежих суши, роллов и пиццы. Японская и итальянская кухня с доставкой на дом.',
    siteName: 'QuikMaki',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'QuikMaki — Доставка роллов и пиццы',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuikMaki — Доставка роллов и пиццы',
    description: 'Доставка свежих суши, роллов и пиццы. Японская и итальянская кухня с доставкой на дом.',
    images: ['/og-image.jpg'],
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
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            expand
            duration={4000}
          />
          <SupportChat />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
