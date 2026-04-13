export default function JakAdoptowacPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
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
            Jak wygląda adopcja?
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-95">
            Prosty proces, który zakończy się nową przyjaźnią
          </p>
        </div>
      </section>

            {/* Adoption Process Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="page-container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--deep-brown)] mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
                            Krok po kroku
                        </h2>
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

            {/* FAQ Section - możesz dodać później */}
            <section className="py-16 bg-[var(--background)]">
                <div className="page-container">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--deep-brown)] mb-8 text-center" style={{ fontFamily: "'Caveat', cursive" }}>
                        Często zadawane pytania
                    </h2>

                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h3 className="text-lg font-bold text-[var(--deep-brown)] mb-2">Ile kosztuje adopcja?</h3>
                            <p className="text-[var(--soft-brown)]">Adopcja jest bezpłatna. Kot jest zdrowy, wykastrowany/wysterylizowany, odrobaczony i zaszczepiony.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h3 className="text-lg font-bold text-[var(--deep-brown)] mb-2">Czy mogę adoptować kota jeśli mam małe dziecko?</h3>
                            <p className="text-[var(--soft-brown)]">Tak! Mamy koty przyjazne dzieciom - są one specjalnie oznaczone jako "Idealne dla rodzin".</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h3 className="text-lg font-bold text-[var(--deep-brown)] mb-2">Czy mogę mieć więcej niż jednego kota?</h3>
                            <p className="text-[var(--soft-brown)]">Oczywiście! Wiele kotów dobrze czuje się w towarzystwie innych kotów. Sprawdź koty oznaczone jako "Dobrze z innymi kotami".</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}