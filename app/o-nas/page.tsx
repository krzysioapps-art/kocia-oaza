"use client";

import Link from "next/link";
import { Metadata } from "next";

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* HERO SECTION */}
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
            O nas
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-95">
            Poznaj naszą misję i wartości
          </p>
        </div>
      </section>
      
      

      {/* IDENTITY SECTION - Kim jesteśmy */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-8 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Kim jesteśmy?
          </h2>

          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-[var(--text-medium)] leading-relaxed">
              Kocia Oaza to inicjatywa tworzona z miłości do zwierząt. Ratujemy koty przed bezdomnością i pomagamy im znaleźć bezpieczne, kochające domy.
            </p>
            <p className="text-lg md:text-xl text-[var(--text-medium)] leading-relaxed">
              Łączymy koty potrzebujące pomocy z ludźmi, którzy są gotowi dać im opiekę i stabilność. Każde zwierzę zasługuje na szansę na spokojne życie.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION SECTION - Nasza misja */}
      <section className="py-20 bg-gradient-to-br from-[var(--soft-peach)] to-[var(--warm-cream)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-12 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Nasza misja
          </h2>

          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="material-icons text-[var(--paw-orange)] text-3xl">
                    track_changes
                  </span>
                </div>
                <p className="text-lg text-[var(--text-medium)] leading-relaxed">
                  Naszym celem jest ograniczanie bezdomności kotów oraz poprawa ich dobrobytu.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="material-icons text-[var(--paw-orange)] text-3xl">
                    health_and_safety
                  </span>
                </div>
                <p className="text-lg text-[var(--text-medium)] leading-relaxed">
                  Największy nacisk kładziemy na kastrację — to najskuteczniejszy sposób walki z bezdomnością.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="material-icons text-[var(--paw-orange)] text-3xl">
                    emergency
                  </span>
                </div>
                <p className="text-lg text-[var(--text-medium)] leading-relaxed">
                  Ratujemy koty chore, porzucone i zapomniane. Trafiają do nas zwierzęta, które często nie mają już żadnych szans — a my staramy się je im przywrócić.
                </p>
              </div>
            </div>

             <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="material-icons text-[var(--paw-orange)] text-3xl">
                    eco
                  </span>
                </div>
                <p className="text-lg text-[var(--text-medium)] leading-relaxed">
                Opiekujemy się również kotami wolno żyjącymi — dokarmiamy je, leczymy i kastrujemy.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="material-icons text-[var(--paw-orange)] text-3xl">
                    groups
                  </span>
                </div>
                <p className="text-lg text-[var(--text-medium)] leading-relaxed">
                  Działamy jako niewielkie stowarzyszenie, ale wierzymy, że z czasem nasz zasięg i możliwości będą coraz większe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT SUMMARY SECTION - Co jest dla nas najważniejsze */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-12 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Co jest dla nas najważniejsze
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ animation: "fadeInUp 0.6s ease-out 0s backwards" }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-2xl flex items-center justify-center mb-6">
                <span className="material-icons text-white text-3xl">
                  favorite
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-4">
                Odpowiedzialna pomoc
              </h3>
              <p className="text-lg text-[var(--text-medium)] leading-relaxed">
                Każdemu kotu poświęcamy tyle czasu i uwagi, ile potrzebuje — od leczenia po znalezienie domu.
              </p>
            </div>

            <div
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ animation: "fadeInUp 0.6s ease-out 0.1s backwards" }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-2xl flex items-center justify-center mb-6">
                <span className="material-icons text-white text-3xl">
                  trending_up
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-4">
                Realna zmiana
              </h3>
              <p className="text-lg text-[var(--text-medium)] leading-relaxed">
                Skupiamy się na działaniach, które realnie ograniczają bezdomność — przede wszystkim kastracji.
              </p>
            </div>

            <div
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ animation: "fadeInUp 0.6s ease-out 0.2s backwards" }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-2xl flex items-center justify-center mb-6">
                <span className="material-icons text-white text-3xl">
                  verified_user
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-4">
                Dopasowane adopcje
              </h3>
              <p className="text-lg text-[var(--text-medium)] leading-relaxed">
                Dbamy o to, aby każdy kot trafił do odpowiedniego domu — nie działamy przypadkowo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Zobacz jak pomagamy */}
      <section className="py-20 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Zobacz, jak pomagamy w praktyce
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed max-w-2xl mx-auto">
            Poznaj dokładnie, jak wygląda nasza codzienna pomoc kotom — od interwencji po adopcję.
          </p>

          <Link
            href="/jak-pomagamy"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--paw-orange)] rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            <span>Jak pomagamy</span>
            <span className="material-icons">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-12 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Skontaktuj się z nami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="material-icons text-white text-3xl">
                  email
                </span>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-dark)] mb-2">
                Email
              </h3>
              <a
                href="mailto:kocia.oaza@gmail.com"
                className="text-[var(--paw-orange)] hover:underline text-lg"
              >
                kocia.oaza@gmail.com
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="material-icons text-white text-3xl">
                  phone
                </span>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-dark)] mb-2">
                Telefon
              </h3>
              <a
                href="tel:+48515621000"
                className="text-[var(--paw-orange)] hover:underline text-lg"
              >
                515 621 000
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="material-icons text-white text-3xl">
                  location_on
                </span>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-dark)] mb-2">
                Lokalizacja
              </h3>
              <p className="text-[var(--text-medium)] text-lg">Warszawa</p>
            </div>
          </div>

          <div className="bg-[var(--soft-peach)] rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <p className="text-lg text-[var(--text-medium)] leading-relaxed">
              Strona ma charakter informacyjny i wspiera działania na rzecz zwierząt.
            </p>
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