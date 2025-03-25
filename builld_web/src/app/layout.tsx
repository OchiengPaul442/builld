import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Builld | Fast-Track Your Ideas into Reality",
  description:
    "High-quality websites and digital products, delivered in weeks — not months.",
  keywords: "web development, digital products, fast development, websites",
  themeColor: "#a0ff00",
  openGraph: {
    type: "website",
    title: "Builld | Fast-Track Your Ideas into Reality",
    description:
      "High-quality websites and digital products, delivered in weeks — not months.",
    siteName: "Builld",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
