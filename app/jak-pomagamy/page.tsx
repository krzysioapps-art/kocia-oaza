"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
    const duration = 1500;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / duration;

      if (progress >= 1) {
        setCount(target);
        return;
      }

      setCount(Math.floor(progress * target));
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [start, target]);

  return <>{count}</>;
}

export default function JakPomagamyPage() {
  const { ref: metricsRef, isVisible: metricsVisible } = useInView(0.3);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* HERO - ustawienie kontekstu */}
      <section className="relative bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] text-white py-16 overflow-hidden">
        {/* Tło dekoracyjne */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative page-container text-center">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Co robimy każdego dnia
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-95">
            Ratujemy, leczymy i pomagamy kotom wrócić do normalnego życia.
          </p>
        </div>
      </section>

      {/* INTRO - emocja + realizm */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl md:text-2xl text-[var(--text-dark)] leading-relaxed text-center">
            Trafiają do nas koty chore, porzucone, często w bardzo złym stanie.{" "}
            <strong className="text-[var(--paw-orange)]">
              Każdy przypadek to czas, koszty i zaangażowanie
            </strong>{" "}
            — ale też szansa na nowe życie.
          </p>
        </div>
      </section>

      {/* PILLARS - główne obszary działania */}
      <section className="py-20 bg-gradient-to-br from-[var(--soft-peach)] to-[var(--warm-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--text-dark)] mb-12 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Jak pomagamy w praktyce
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: "emergency",
                title: "Ratowanie",
                description:
                  "Przyjmujemy koty chore, po wypadkach, porzucone i bezdomne. Często trafiają do nas w stanie wymagającym natychmiastowej pomocy.",
                color: "from-red-500 to-orange-500",
              },
              {
                icon: "medical_services",
                title: "Leczenie",
                description:
                  "Diagnostyka, wizyty u weterynarza, leczenie i rekonwalescencja. Każdy kot dostaje tyle czasu, ile potrzebuje.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: "health_and_safety",
                title: "Kastracje",
                description:
                  "Kastracja to najskuteczniejszy sposób walki z bezdomnością. Pomagamy również kotom wolno żyjącym.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: "home",
                title: "Domy i adopcje",
                description:
                  "Dbamy o to, żeby każdy kot trafił do miejsca dopasowanego do jego potrzeb. Proces adopcji nie jest przypadkowy.",
                color: "from-purple-500 to-pink-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
                }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <span className="material-icons text-white text-3xl">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-3">
                  {item.title}
                </h3>
                <p className="text-[var(--text-medium)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT - liczby i wiarygodność */}
      <section className="py-20 bg-[var(--background)]" ref={metricsRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--text-dark)] mb-16 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Efekty naszej pracy
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: 120, label: "uratowanych kotów", icon: "favorite" },
              { value: 300, label: "kastracji", icon: "health_and_safety" },
              { value: 40, label: "adopcji", icon: "home" },
            ].map((metric, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-3xl p-8 shadow-lg"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.15}s backwards`,
                }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-white text-4xl">
                    {metric.icon}
                  </span>
                </div>
                <div
                  className="text-5xl md:text-6xl font-bold text-[var(--paw-orange)] mb-2"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  <Counter target={metric.value} start={metricsVisible} />+
                </div>
                <p className="text-lg text-[var(--text-medium)] font-medium">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS - droga kota */}
      <section className="py-20 bg-gradient-to-br from-[var(--warm-cream)] to-[var(--soft-peach)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--text-dark)] mb-16 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Co dzieje się z kotem
          </h2>

          <div className="relative">
            {/* Linia łącząca */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-[var(--warm-coral)] via-[var(--paw-orange)] to-[var(--warm-coral)] opacity-20" />

            <div className="grid md:grid-cols-4 gap-8 relative">
              {[
                {
                  number: "1",
                  title: "Trafia do nas",
                  description: "Przyjmujemy kota i oceniamy jego stan",
                  icon: "pets",
                },
                {
                  number: "2",
                  title: "Diagnostyka i leczenie",
                  description: "Zapewniamy opiekę weterynaryjną i leczenie",
                  icon: "medical_services",
                },
                {
                  number: "3",
                  title: "Regeneracja",
                  description: "Koty dochodzą do siebie fizycznie i psychicznie",
                  icon: "spa",
                },
                {
                  number: "4",
                  title: "Szukamy domu",
                  description: "Dopasowujemy odpowiedni dom do potrzeb kota",
                  icon: "home",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative text-center"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.15}s backwards`,
                  }}
                >
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-full flex items-center justify-center shadow-xl relative z-10">
                      <span className="material-icons text-white text-5xl">
                        {step.icon}
                      </span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-20 border-4 border-[var(--background)]">
                      <span className="text-2xl font-bold text-[var(--paw-orange)]">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-dark)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[var(--text-medium)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REALITY - autentyczność */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-10 md:p-12 shadow-xl border-l-8 border-[var(--paw-orange)]">
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--text-dark)] mb-6"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              To nie zawsze jest łatwe
            </h2>
            <p className="text-xl text-[var(--text-medium)] leading-relaxed">
              Leczenie bywa długie, a nie każdy kot od razu ufa człowiekowi.{" "}
              <strong className="text-[var(--text-dark)]">
                Niektóre historie są trudne
              </strong>{" "}
              — ale każdy kot zasługuje na szansę.
            </p>
          </div>
        </div>
      </section>

      {/* WAYS TO HELP - konwersja */}
      <section className="py-20 bg-gradient-to-br from-[var(--soft-peach)] to-[var(--warm-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--text-dark)] mb-12 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Jak możesz pomóc
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "home",
                title: "Adoptuj",
                description: "Daj kotu dom na stałe",
                cta: "Zobacz koty",
                link: "/",
                color: "from-[var(--warm-coral)] to-[var(--paw-orange)]",
              },
              {
                icon: "schedule",
                title: "Dom tymczasowy",
                description: "Pomóż kotu dojść do siebie zanim znajdzie dom",
                cta: "Dowiedz się więcej",
                link: "/jak-adoptowac",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: "volunteer_activism",
                title: "Wesprzyj",
                description: "Pomóż nam finansować leczenie i opiekę",
                cta: "Wesprzyj nas",
                link: "/",
                color: "from-blue-500 to-cyan-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.15}s backwards`,
                }}
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center mb-6`}
                >
                  <span className="material-icons text-white text-4xl">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-3">
                  {item.title}
                </h3>
                <p className="text-[var(--text-medium)] mb-6 leading-relaxed">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${item.color} text-white rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all`}
                >
                  <span>{item.cta}</span>
                  <span className="material-icons text-sm">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - zamknięcie emocji */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Każdy kot zasługuje na szansę
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed">
            Dzięki ludziom takim jak Ty możemy pomagać dalej.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/koty"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--paw-orange)] rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              <span>Poznaj koty</span>
              <span className="material-icons">pets</span>
            </Link>

            <Link
              href="https://www.ratujemyzwierzaki.pl/en/kociaoaza"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white rounded-full font-bold text-lg hover:bg-white/30 hover:shadow-xl transition-all"
            >
              <span>Wesprzyj nas</span>
              <span className="material-icons">volunteer_activism</span>
            </Link>
          </div>
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