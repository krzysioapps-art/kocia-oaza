"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple password check - improve later with proper auth
    if (password === "kocia123") {
      localStorage.setItem("admin_authenticated", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Nieprawidłowe hasło");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--soft-peach)] via-[var(--muted-mauve)] to-[var(--gentle-rose)]">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 border border-[var(--warm-coral)]/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] mb-4">
              <span className="material-icons text-white text-3xl">pets</span>
            </div>
            <h1 className="text-3xl font-bold text-[var(--deep-brown)] mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
              Kocia Oaza
            </h1>
            <p className="text-[var(--soft-brown)]">Panel Administracyjny</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--deep-brown)] mb-2">
                Hasło
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--warm-coral)]/30 focus:border-[var(--paw-orange)] focus:outline-none transition-colors"
                placeholder="Wprowadź hasło"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700">
                <span className="material-icons text-sm">error</span>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logowanie..." : "Zaloguj się"}
            </button>
          </form>

          {/* Back to site */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-[var(--soft-brown)] hover:text-[var(--paw-orange)] transition-colors inline-flex items-center gap-1"
            >
              <span className="material-icons text-sm">arrow_back</span>
              Wróć do strony głównej
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--soft-brown)]">
            Dla administratorów Kociej Oazy
          </p>
        </div>
      </div>
    </div>
  );
}