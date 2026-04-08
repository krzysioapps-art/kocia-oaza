"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MenuIcon,
  CloseIcon,
  EmailIcon,
  PhoneIcon,
  LocationIcon,
} from "@/components/Icons";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  // For admin pages, render only children (no header/footer)
  if (isAdminPage) {
    return <>{children}</>;
  }

  // For public pages, render with header and footer
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--cream)]/80 border-b border-[var(--warm-coral)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/kocia_oaza_sygnet.svg"
                  alt="Kocia Oaza logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--deep-brown)] font-display">
                  Kocia Oaza
                </h1>
                <p className="text-xs text-[var(--soft-brown)]">
                  Znajdź swojego przyjaciela
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/koty"
                className="flex items-center h-10 leading-none text-[var(--deep-brown)] hover:text-[var(--paw-orange)] font-medium transition-colors"
              >
                Koty do adopcji
              </Link>

              <Link
                href="/#proces"
                className="flex items-center h-10 leading-none text-[var(--deep-brown)] hover:text-[var(--paw-orange)] font-medium transition-colors"
              >
                Jak adoptować?
              </Link>

              <Link
                href="/o-nas"
                className="flex items-center h-10 leading-none text-[var(--deep-brown)] hover:text-[var(--paw-orange)] font-medium transition-colors"
              >
                O nas
              </Link>
            </nav>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--warm-coral)]/20 transition"
              aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            >
              <span className="text-[var(--deep-brown)]">
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 md:hidden shadow-2xl
          transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 p-3 -m-2"
          aria-label="Zamknij menu"
        >
          <span className="text-[var(--deep-brown)]">
            <CloseIcon />
          </span>
        </button>

        <nav className="p-6 pt-16 flex flex-col gap-6">
          <Link href="/koty" onClick={() => setMenuOpen(false)} className="text-lg font-semibold">
            Koty do adopcji
          </Link>
          <Link href="/#proces" onClick={() => setMenuOpen(false)} className="text-lg font-semibold">
            Jak adoptować?
          </Link>
          <Link href="/o-nas" onClick={() => setMenuOpen(false)} className="text-lg font-semibold">
            O nas
          </Link>
        </nav>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`
          fixed inset-0 bg-black/30 z-40 md:hidden
          transition-opacity duration-300
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="mt-20 bg-gradient-to-b from-[var(--muted-mauve)] to-[var(--soft-peach)] border-t border-[var(--warm-coral)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[var(--deep-brown)] font-display">
                Kocia Oaza
              </h3>
              <p className="text-sm text-[var(--soft-brown)] leading-relaxed">
                Pomagamy kotom znaleźć kochające domy. Każdy kotek zasługuje na bezpieczne i szczęśliwe miejsce.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-[var(--deep-brown)]">Linki</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/koty"
                    className="text-[var(--soft-brown)] hover:text-[var(--paw-orange)] transition-colors"
                  >
                    Koty do adopcji
                  </Link>
                </li>
                <li>
                  <Link
                    href="/o-nas"
                    className="text-[var(--soft-brown)] hover:text-[var(--paw-orange)] transition-colors"
                  >
                    O nas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/polityka-prywatnosci"
                    className="text-[var(--soft-brown)] hover:text-[var(--paw-orange)] transition-colors"
                  >
                    Polityka prywatności
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-[var(--deep-brown)]">Kontakt</h4>
              <p className="text-sm text-[var(--soft-brown)] mb-2">
                <a
                  href="mailto:kocia.oaza@gmail.com"
                  className="hover:text-[var(--paw-orange)] transition-colors flex items-center gap-2"
                >
                  <EmailIcon />
                  kocia.oaza@gmail.com
                </a>
              </p>
              <p className="text-sm text-[var(--soft-brown)] mb-2">
                <a
                  href="tel:515621000"
                  className="hover:text-[var(--paw-orange)] transition-colors flex items-center gap-2"
                >
                  <PhoneIcon />
                  515 621 000
                </a>
              </p>
              <p className="text-sm text-[var(--soft-brown)] flex items-center gap-2">
                <LocationIcon />
                Warszawa
              </p>
              <div className="flex gap-3 mt-4">
                <a
                  href="https://facebook.com/kocia-oaza"
                  className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center hover:bg-[var(--warm-coral)] hover:text-white transition-all"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/kocia-oaza"
                  className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center hover:bg-[var(--warm-coral)] hover:text-white transition-all"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[var(--warm-coral)]/20 text-center text-sm text-[var(--soft-brown)]">
            <p>© {new Date().getFullYear()} Kocia Oaza. Każdy kotek zasługuje na miłość.</p>
          </div>
        </div>
      </footer>
    </>
  );
}