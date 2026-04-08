"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function Counter({ target, start }: { target: number; start: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;
    const duration = 1200;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / duration;

      if (progress >= 1) {
        setCount(target);
        return;
      }

      // 🔥 MNIEJ aktualizacji — co ~50ms zamiast co frame
      if (Math.floor(progress * 20) !== Math.floor((count / target) * 20)) {
        setCount(Math.floor(progress * target));
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [start, target]);

  return <>{count}</>;
}

export default function Home() {
  const { ref, isVisible } = useInView();
  const [cats, setCats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      setIsLoading(true);

      const { data: catsData } = await supabase
        .from("cats")
        .select("id, name, slug, gender, tags, good_with_children, good_with_cats")
        .eq("status", "available")
        .is("deleted_at", null)
        .limit(6);

      // Fetch primary images for each cat
      const catsWithImages = await Promise.all(
        (catsData || []).map(async (cat) => {
          const { data: media } = await supabase
            .from("cat_media")
            .select("url")
            .eq("cat_id", cat.id)
            .eq("is_primary", true)
            .single();

          return {
            ...cat,
            image_url: media?.url || null,
          };
        })
      );

      setCats(catsWithImages);
      setIsLoading(false);
    };

    fetchCats();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--soft-peach)] via-[var(--muted-mauve)] to-[var(--gentle-rose)] py-16 md:py-24">
        <div className="absolute inset-0 paw-pattern pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 md:animate-bounce">
            <span className="material-icons" style={{ fontSize: '80px', color: 'var(--paw-orange)' }}>pets</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--deep-brown)] mb-6 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
            Znajdź swojego<br />
            <span className="text-[var(--paw-orange)]">mruczącego przyjaciela</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--soft-brown)] max-w-2xl mx-auto mb-8 leading-relaxed">
            Każdy z naszych kotków czeka na dom pełen miłości. Daj im szansę na szczęśliwe życie u Twojego boku.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/koty"
              className="relative z-20 pointer-events-auto px-8 py-4 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Zobacz koty do adopcji</span>
              <span className="material-icons">arrow_forward</span>
            </Link>
            <a
              href="#proces"
              className="px-8 py-4 bg-white/80 backdrop-blur text-[var(--deep-brown)] rounded-full font-semibold text-lg hover:bg-white hover:shadow-lg transition-all"
            >
              Jak adoptować?
            </a>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[var(--warm-coral)]/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[var(--paw-orange)]/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </section>

      {/* Stats Section */}
      <section ref={ref} className="py-12 bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-[var(--paw-orange)] mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
                <Counter target={cats.length || 50} start={isVisible} />+
              </div>
              <div className="text-sm md:text-base text-[var(--soft-brown)]">Kotków czeka</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-[var(--paw-orange)] mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
                <Counter target={200} start={isVisible} />+
              </div>
              <div className="text-sm md:text-base text-[var(--soft-brown)]">Szczęśliwych adopcji</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-[var(--paw-orange)] mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
                <Counter target={100} start={isVisible} />%
              </div>
              <div className="text-sm md:text-base text-[var(--soft-brown)]">Kochane kotki</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cats Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--deep-brown)] mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
              Poznaj nasze kotki
            </h2>
            <p className="text-lg text-[var(--soft-brown)]">
              Każdy z nich marzy o kochającym domu
            </p>
          </div>

          {/* Cats Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-3xl mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {cats.map((cat, index) => (
                <Link
                  key={cat.id}
                  href={`/koty/${cat.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[var(--warm-coral)]/10"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
                  }}
                >
                  <div className="relative overflow-hidden">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-64 bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] flex items-center justify-center">
                        <span className="material-icons opacity-50" style={{ fontSize: "64px", color: "var(--deep-brown)" }}>
                          pets
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-[var(--deep-brown)] shadow-lg flex items-center gap-1">
                      {cat.gender === "female" ? (
                        <>
                          <span className="material-icons text-sm">favorite</span> Kotka
                        </>
                      ) : cat.gender === "male" ? (
                        <>
                          <span className="material-icons text-sm">favorite</span> Kocur
                        </>
                      ) : (
                        <span className="material-icons text-sm">pets</span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3
                      className="text-2xl font-bold text-[var(--deep-brown)] mb-2 group-hover:text-[var(--paw-orange)] transition-colors"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      {cat.name}
                    </h3>

                    {cat.tags && cat.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-3">
                        {cat.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs bg-gradient-to-r from-[var(--soft-peach)] to-[var(--gentle-rose)] text-[var(--deep-brown)] px-3 py-1 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-[var(--warm-coral)]/20 flex items-center justify-between">
                      <div className="flex gap-2 text-sm">
                        {cat.good_with_children && (
                          <span className="material-icons text-sm" title="Dla dzieci">
                            child_care
                          </span>
                        )}
                        {cat.good_with_cats && (
                          <span className="material-icons text-sm" title="Z innymi kotami">
                            pets
                          </span>
                        )}
                      </div>
                      <span className="text-[var(--paw-orange)] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Zobacz więcej <span className="material-icons text-sm">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* See All Button */}
          <div className="text-center">
            <Link
              href="/koty"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <span>Zobacz wszystkie kotki</span>
              <span className="material-icons">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Adoption Process Section */}
      <section id="proces" className="py-16 md:py-20 scroll-mt-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--deep-brown)] mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
              Jak wygląda adopcja krok po kroku?
            </h2>
            <p className="text-lg text-[var(--soft-brown)]">
              Prosty proces, który zakończy się nową przyjaźnią
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-3xl p-6 border border-[var(--warm-coral)]/20 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
                Zgłoszenie
              </h3>
              <p className="text-[var(--soft-brown)] text-sm leading-relaxed mb-3">
                Wyślij formularz klikając „Adoptuj" przy wybranym kocie.
              </p>
              <div className="bg-white/60 rounded-xl p-3 text-sm">
                <p className="text-[var(--deep-brown)] font-semibold mb-1">Lub zadzwoń:</p>
                <a href="tel:515621000" className="text-[var(--paw-orange)] font-bold flex items-center gap-2">
                  <span className="material-icons text-sm">phone</span>
                  515 621 000
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-3xl p-6 border border-[var(--warm-coral)]/20 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
                Poznanie kota
              </h3>
              <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                Spotykasz kota w kociarni (Warszawa, Wola – Miau Café) lub w domu tymczasowym.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-3xl p-6 border border-[var(--warm-coral)]/20 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white flex items-center justify-center font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
                Decyzja i umowa
              </h3>
              <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                Podpisujemy umowę i pomagamy Ci spokojnie przyjąć kota do domu.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-3xl p-6 border border-[var(--warm-coral)]/20 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white flex items-center justify-center font-bold text-xl mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
                Po adopcji
              </h3>
              <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                Przerejestruj chip u weterynarza.
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg border border-[var(--warm-coral)]/20">
            <h3 className="text-2xl font-bold text-[var(--deep-brown)] mb-6 text-center flex items-center justify-center gap-2" style={{ fontFamily: "'Caveat', cursive" }}>
              <span className="material-icons">checklist</span>
              Warunki adopcji
            </h3>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 bg-gradient-to-r from-[var(--soft-peach)] to-[var(--gentle-rose)] p-4 rounded-2xl">
                <span className="material-icons text-[var(--paw-orange)]">home</span>
                <span className="font-medium text-[var(--deep-brown)]">Dom niewychodzący</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-[var(--soft-peach)] to-[var(--gentle-rose)] p-4 rounded-2xl">
                <span className="material-icons text-[var(--paw-orange)]">window</span>
                <span className="font-medium text-[var(--deep-brown)]">Zabezpieczone okna</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-[var(--soft-peach)] to-[var(--gentle-rose)] p-4 rounded-2xl">
                <span className="material-icons text-[var(--paw-orange)]">deck</span>
                <span className="font-medium text-[var(--deep-brown)]">Osiatkowany balkon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
            Gotowy na nowego przyjaciela?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
            Każdy kotek zasługuje na dom pełen miłości. Adopcja to nie tylko ratunek dla zwierzaka, ale także rozpoczęcie pięknej przyjaźni.
          </p>
          <Link
            href="/koty"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[var(--paw-orange)] rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            <span className="material-icons">pets</span>
            <span>Zobacz nasze kotki</span>
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}