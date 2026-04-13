import type { Metadata } from "next";
import { Quicksand, Caveat } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./ConditionalLayout";

// Optimized font loading - only used weights
const quicksand = Quicksand({
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: '--font-quicksand',
  display: 'swap',
});

const caveat = Caveat({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Stowarzyszenie Kocia Oaza Koci Raj | Znajdź swojego przyjaciela",
    template: "%s | Kocia Oaza"
  },
  description: "Adoptuj kota z Kociej Oazy. Każdy kotek zasługuje na kochający dom. Pomóż nam znaleźć im bezpieczne i szczęśliwe miejsce.",
  keywords: ["adopcja kotów", "koty do adopcji", "adopcja zwierząt", "schronisko dla kotów", "Warszawa", "Kocia Oaza"],
  authors: [{ name: "Stowarzyszenie Kocia Oaza Koci Raj" }],
  creator: "Stowarzyszenie Kocia Oaza Koci Raj",
  publisher: "Stowarzyszenie Kocia Oaza Koci Raj",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kocia-oaza.pl'),

  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: '/',
    siteName: 'Stowarzyszenie Kocia Oaza Koci Raj',
    title: 'Stowarzyszenie Kocia Oaza Koci Raj',
    description: 'Adoptuj kota z Kociej Oazy. Każdy kotek zasługuje na kochający dom.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Stowarzyszenie Kocia Oaza Koci Raj',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stowarzyszenie Kocia Oaza Koci Raj',
    description: 'Adoptuj kota z Kociej Oazy. Każdy kotek zasługuje na kochający dom.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" }, // 🔥 najważniejsze
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${quicksand.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />

        {/* Material Icons - needed for existing pages */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AnimalShelter",
              "name": "Stowarzyszenie Kocia Oaza Koci Raj",
              "description": "Kocia Oaza pomaga kotom znaleźć kochające domy",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://kocia-oaza.pl",
              "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kocia-oaza.pl'}/kocia_oaza_sygnet.svg`,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Warszawa",
                "addressCountry": "PL"
              },
              "email": "kocia.oaza@gmail.com",
              "telephone": "+48515621000",
              "sameAs": [
                "https://facebook.com/kocia-oaza",
                "https://instagram.com/kocia-oaza"
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}