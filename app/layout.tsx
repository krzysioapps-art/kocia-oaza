import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kocia Oaza - Adopcje Kotów | Znajdź swojego przyjaciela",
  description: "Adoptuj kota z Kociej Oazy. Każdy kotek zasługuje na kochający dom. Pomóż nam znaleźć im bezpieczne i szczęśliwe miejsce.",
  icons: {
    icon: "/kocia_oaza_sygnet.svg",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}