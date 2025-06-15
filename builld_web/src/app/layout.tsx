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
  title: 'Builld | Fast-Track Your Ideas into Reality',
  description:
    'High-quality websites and digital products, delivered in weeks — not months.',
  keywords: 'web development, digital products, fast development, websites',
  openGraph: {
    type: 'website',
    title: 'Builld | Fast-Track Your Ideas into Reality',
    description:
      'High-quality websites and digital products, delivered in weeks — not months.',
    siteName: 'Builld',
  },
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
