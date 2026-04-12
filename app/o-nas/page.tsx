import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--soft-peach)] via-[var(--muted-mauve)] to-[var(--gentle-rose)] py-16">
        <div className="page-container text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--deep-brown)] mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
            O nas
          </h1>
          <p className="text-lg text-[var(--soft-brown)]">
            Poznaj naszą misję i wartości
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="page-container">

          {/* Mission */}
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--warm-coral)]/20 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-icons text-4xl text-[var(--paw-orange)]">favorite</span>
              <h2 className="text-3xl font-bold text-[var(--deep-brown)]" style={{ fontFamily: "'Caveat', cursive" }}>
                Kim jesteśmy?
              </h2>
            </div>

            <p className="text-[var(--deep-brown)] leading-relaxed text-lg mb-6">
              <strong>Kocia Oaza</strong> to inicjatywa tworzona z miłości do zwierząt. Ratujemy koty przed bezdomnością i pomagamy im znaleźć bezpieczne, kochające domy.
            </p>

            <p className="text-[var(--deep-brown)] leading-relaxed text-lg">
              Naszym celem jest łączenie ludzi z kotami, które czekają na swoją szansę. Każde zwierzę zasługuje na opiekę, spokój i odpowiedzialnego opiekuna.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--warm-coral)]/20 mb-12">
            <h2
              className="text-3xl font-bold text-[var(--deep-brown)] mb-6"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Nasza misja
            </h2>

            <p className="text-[var(--deep-brown)] text-lg leading-relaxed mb-6">
              Kotom pomagamy już od kilku lat, a jako stowarzyszenie działamy od 2022 roku.
              Mamy za sobą dziesiątki udanych adopcji oraz setki wykonanych kastracji i sterylizacji.
            </p>

            <p className="text-[var(--deep-brown)] text-lg leading-relaxed mb-6">
              Naszym celem jest <strong>ograniczanie bezdomności kotów</strong> oraz poprawa ich dobrobytu.
              Największy nacisk kładziemy na kastrację — to najskuteczniejszy sposób walki z bezdomnością.
            </p>

            <p className="text-[var(--deep-brown)] text-lg leading-relaxed mb-6">
              Ratujemy koty chore, porzucone i zapomniane. Trafiają do nas zwierzęta,
              które często nie mają już żadnych szans — a my staramy się je im przywrócić.
            </p>

            <p className="text-[var(--deep-brown)] text-lg leading-relaxed mb-6">
              Opiekujemy się również kotami wolnożyjącymi — dokarmiamy je,
              leczymy i kastrujemy. Obecnie mamy pod opieką kilka stad kotów,
              które regularnie wspieramy.
            </p>

            <p className="text-[var(--deep-brown)] text-lg leading-relaxed">
              Działamy jako niewielkie stowarzyszenie, ale wierzymy,
              że z czasem nasz zasięg i możliwości będą coraz większe.
            </p>
          </div>




          <div className="mb-12">
            <h2
              className="text-3xl font-bold text-[var(--deep-brown)] mb-8 text-center"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Jak pomagamy?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-[var(--warm-coral)]/20 shadow-lg text-center">
                <span className="material-icons text-4xl text-[var(--paw-orange)] mb-3">
                  public
                </span>
                <h3 className="font-bold text-[var(--deep-brown)] mb-2">
                  Walczymy z bezdomnością
                </h3>
                <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                  Działamy, aby ograniczyć liczbę bezdomnych kotów i poprawić ich warunki życia
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-[var(--warm-coral)]/20 shadow-lg text-center">
                <span className="material-icons text-4xl text-[var(--paw-orange)] mb-3">
                  content_cut
                </span>
                <h3 className="font-bold text-[var(--deep-brown)] mb-2">
                  Kastrujemy koty wolnożyjące
                </h3>
                <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                  Wspieramy kontrolę populacji poprzez kastrację i opiekę nad kotami wolno żyjącymi
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-[var(--warm-coral)]/20 shadow-lg text-center">
                <span className="material-icons text-4xl text-[var(--paw-orange)] mb-3">
                  medical_services
                </span>
                <h3 className="font-bold text-[var(--deep-brown)] mb-2">
                  Pomagamy w sterylizacji
                </h3>
                <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                  Pomagamy opiekunom w organizacji i finansowaniu zabiegów sterylizacji
                </p>
              </div>

            </div>
          </div>

          {/* What we do */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[var(--deep-brown)] mb-8 text-center" style={{ fontFamily: "'Caveat', cursive" }}>
              Co robimy?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-2xl p-6 border border-[var(--warm-coral)]/20">
                <div className="flex items-start gap-4">
                  <span className="material-icons text-3xl text-[var(--paw-orange)]">pets</span>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2">Pomagamy w adopcji kotów</h3>
                    <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                      Łączymy koty potrzebujące domu z osobami gotowymi dać im miłość i bezpieczeństwo
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-2xl p-6 border border-[var(--warm-coral)]/20">
                <div className="flex items-start gap-4">
                  <span className="material-icons text-3xl text-[var(--paw-orange)]">campaign</span>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2">Publikujemy aktualne ogłoszenia</h3>
                    <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                      Regularnie aktualizujemy informacje o kotach szukających domu
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-2xl p-6 border border-[var(--warm-coral)]/20">
                <div className="flex items-start gap-4">
                  <span className="material-icons text-3xl text-[var(--paw-orange)]">group</span>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2">Wspieramy opiekunów i wolontariuszy</h3>
                    <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                      Tworzymy sieć wsparcia dla osób zaangażowanych w pomoc zwierzętom
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-2xl p-6 border border-[var(--warm-coral)]/20">
                <div className="flex items-start gap-4">
                  <span className="material-icons text-3xl text-[var(--paw-orange)]">school</span>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2">Edukujemy w zakresie opieki</h3>
                    <p className="text-[var(--soft-brown)] text-sm leading-relaxed">
                      Dzielimy się wiedzą o potrzebach kotów i odpowiedzialnej opiece
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Caveat', cursive" }}>
              Skontaktuj się z nami
            </h2>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
              <a href="mailto:kocia.oaza@gmail.com" className="flex items-center gap-2 text-lg hover:underline">
                <span className="material-icons">email</span>
                kocia.oaza@gmail.com
              </a>
              <a href="tel:515621000" className="flex items-center gap-2 text-lg hover:underline">
                <span className="material-icons">phone</span>
                515 621 000
              </a>
              <span className="flex items-center gap-2 text-lg">
                <span className="material-icons">location_on</span>
                Warszawa
              </span>
            </div>

            <p className="text-sm opacity-90">
              Strona ma charakter informacyjny i wspiera działania na rzecz zwierząt.
            </p>
          </div>

          {/* Back to cats */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <span className="material-icons">arrow_back</span>
              <span>Wróć do kotów</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}