import type { Metadata, Viewport } from 'next';
import { Lexend } from 'next/font/google';
import { ToastProvider } from '@/components/ui/toast';
import ErrorBoundary from '@/components/ui/error-boundary';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

// Load Lexend font
const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'Builld | Fast-Track Your Ideas into Reality',
    template: '%s | Builld',
  },
  description:
    'Builld delivers high-quality, custom websites and digital products for startups, founders, and businesses. Launch your next idea in weeks, not months, with our expert web development, UI/UX design, and digital solutions.',
  keywords: [
    'web development',
    'digital products',
    'UI/UX design',
    'startup websites',
    'business websites',
    'custom web apps',
    'Next.js',
    'React',
    'fast website launch',
    'MVP development',
    'product design',
    'branding',
    'web agency',
    'Builld',
    'build website',
    'launch digital product',
    'modern web design',
    'responsive websites',
    'SEO',
    'performance',
    'animations',
    'creative agency',
    'technology partner',
    'scalable solutions',
    'growth',
    'innovation',
  ],
  authors: [{ name: 'Builld Technologies', url: 'https://builld.com' }],
  creator: 'Builld Technologies',
  publisher: 'Builld Technologies',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://builld.com',
    title: 'Builld | Fast-Track Your Ideas into Reality',
    description:
      'Launch your next big idea with Builld. We create high-quality, scalable websites and digital products for startups and businesses, delivered in weeks — not months.',
    siteName: 'Builld',
    images: [
      {
        url: 'https://builld.com/images/logo.svg',
        width: 512,
        height: 512,
        alt: 'Builld Logo',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@builld_tech',
    creator: '@builld_tech',
    title: 'Builld | Fast-Track Your Ideas into Reality',
    description:
      'High-quality websites and digital products, delivered in weeks — not months. Launch your next idea with Builld.',
    images: ['https://builld.com/images/logo.svg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: '#a0ff00',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={lexend.className}>
      <body>
        <ErrorBoundary>
          <ToastProvider>
            {children}
            <Analytics />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
