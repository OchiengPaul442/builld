import type { Metadata } from "next";
import "./globals.css";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Builld" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
