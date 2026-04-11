import Link from "next/link";

export default function TrustGuidePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--soft-peach)] via-[var(--muted-mauve)] to-[var(--gentle-rose)] py-16">
        <div className="page-container text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--deep-brown)] mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
            Jak zdobyć zaufanie kota i czego nie robić?
          </h1>
          <p className="text-lg text-[var(--soft-brown)]">
            Lista rzeczy o których warto pamiętać
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="page-container max-w-4xl">

          {/* Expectation */}
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--warm-coral)]/20 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-icons text-4xl text-[var(--paw-orange)]">schedule</span>
              <h2 className="text-3xl font-bold text-[var(--deep-brown)]" style={{ fontFamily: "'Caveat', cursive" }}>
                Zaufanie ≠ natychmiastowa miłość
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-icons text-[var(--warm-coral)] mt-1">arrow_right</span>
                <p className="text-[var(--deep-brown)] leading-relaxed text-lg">
                  dla kota jesteś obcą osobą
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-icons text-[var(--warm-coral)] mt-1">arrow_right</span>
                <p className="text-[var(--deep-brown)] leading-relaxed text-lg">
                  zaufanie buduje się dniami (czasem tygodniami)
                </p>
              </div>
            </div>
          </div>

          {/* Space */}
          <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-3xl p-8 md:p-12 shadow-lg border border-[var(--warm-coral)]/20 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-icons text-4xl text-[var(--paw-orange)]">home</span>
              <h2 className="text-3xl font-bold text-[var(--deep-brown)]" style={{ fontFamily: "'Caveat', cursive" }}>
                Daj kotu przestrzeń
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="material-icons text-[var(--warm-coral)] mt-1">close</span>
                <p className="text-[var(--deep-brown)] leading-relaxed text-lg">
                  nie wyciągaj go z kryjówki
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-icons text-[var(--warm-coral)] mt-1">visibility</span>
                <p className="text-[var(--deep-brown)] leading-relaxed text-lg">
                  pozwól mu obserwować
                </p>
              </div>
            </div>

            <div className="bg-white/60 rounded-2xl p-4 border-l-4 border-[var(--paw-orange)]">
              <p className="text-[var(--soft-brown)] italic">
                kot musi sam zdecydować: „ok, jesteś bezpieczny"
              </p>
            </div>
          </div>

          {/* Approach */}
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--warm-coral)]/20 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-icons text-4xl text-[var(--paw-orange)]">pan_tool</span>
              <h2 className="text-3xl font-bold text-[var(--deep-brown)]" style={{ fontFamily: "'Caveat', cursive" }}>
                Pozwól kotu zrobić pierwszy krok
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-xl p-4 text-center">
                <span className="material-icons text-3xl text-[var(--paw-orange)] mb-2">event_seat</span>
                <p className="text-[var(--deep-brown)] font-medium">usiądź spokojnie</p>
              </div>
              <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-xl p-4 text-center">
                <span className="material-icons text-3xl text-[var(--paw-orange)] mb-2">visibility_off</span>
                <p className="text-[var(--deep-brown)] font-medium">nie patrz intensywnie</p>
              </div>
              <div className="bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-xl p-4 text-center">
                <span className="material-icons text-3xl text-[var(--paw-orange)] mb-2">back_hand</span>
                <p className="text-[var(--deep-brown)] font-medium">wyciągnij rękę i czekaj</p>
              </div>
            </div>

            <div className="bg-white/60 rounded-2xl p-4 border-l-4 border-[var(--paw-orange)]">
              <p className="text-[var(--soft-brown)] italic">
                inicjatywa = jego decyzja
              </p>
            </div>
          </div>

          {/* Communication */}
          <div className="bg-gradient-to-br from-[var(--muted-mauve)] to-[var(--gentle-rose)] rounded-3xl p-8 md:p-12 shadow-lg border border-[var(--warm-coral)]/20 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-icons text-4xl text-[var(--paw-orange)]">chat_bubble</span>
              <h2 className="text-3xl font-bold text-[var(--deep-brown)]" style={{ fontFamily: "'Caveat', cursive" }}>
                Mów „kocim językiem"
              </h2>
            </div>

            <div className="bg-white/70 rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-icons text-3xl text-[var(--paw-orange)]">remove_red_eye</span>
                <p className="text-[var(--deep-brown)] text-lg font-medium">
                  powolne mruganie = „ufam Ci"
                </p>
              </div>
            </div>

            <div className="bg-white/60 rounded-2xl p-4 border-l-4 border-[var(--paw-orange)]">
              <p className="text-[var(--soft-brown)] italic">
                spróbuj tego zamiast głaskania na siłę
              </p>
            </div>
          </div>

          {/* Routine */}
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--warm-coral)]/20 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-icons text-4xl text-[var(--paw-orange)]">access_time</span>
              <h2 className="text-3xl font-bold text-[var(--deep-brown)]" style={{ fontFamily: "'Caveat', cursive" }}>
                Rutyna = poczucie bezpieczeństwa
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="material-icons text-[var(--warm-coral)] mt-1">restaurant</span>
                <p className="text-[var(--deep-brown)] leading-relaxed text-lg">
                  karmienie o stałych porach
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-icons text-[var(--warm-coral)] mt-1">self_improvement</span>
                <p className="text-[var(--deep-brown)] leading-relaxed text-lg">
                  spokojne rytuały
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-2xl p-4 border-l-4 border-[var(--paw-orange)]">
              <p className="text-[var(--soft-brown)] italic">
                kot kocha przewidywalność
              </p>
            </div>
          </div>

          {/* Don'ts */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-lg border-2 border-red-300/40 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-icons text-4xl text-red-500">block</span>
              <h2 className="text-3xl font-bold text-[var(--deep-brown)]" style={{ fontFamily: "'Caveat', cursive" }}>
                Czego nie robić?
              </h2>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 bg-white/70 rounded-xl p-4">
                <span className="material-icons text-red-500 mt-1">close</span>
                <p className="text-[var(--deep-brown)] leading-relaxed text-lg">
                  branie na ręce bez zgody
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white/70 rounded-xl p-4">
                <span className="material-icons text-red-500 mt-1">close</span>
                <p className="text-[var(--deep-brown)] leading-relaxed text-lg">
                  gonienie kota
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white/70 rounded-xl p-4">
                <span className="material-icons text-red-500 mt-1">close</span>
                <p className="text-[var(--deep-brown)] leading-relaxed text-lg">
                  hałas i chaos
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white/70 rounded-xl p-4">
                <span className="material-icons text-red-500 mt-1">close</span>
                <p className="text-[var(--deep-brown)] leading-relaxed text-lg">
                  „bo musi się przyzwyczaić"
                </p>
              </div>
            </div>

            <div className="bg-red-100/70 rounded-2xl p-4 border-l-4 border-red-500">
              <p className="text-red-900 font-medium italic">
                to niszczy zaufanie
              </p>
            </div>
          </div>

          {/* Insight */}
          <div className="bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-3xl p-8 md:p-12 shadow-2xl border border-orange-300/30 mb-12 text-white">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-icons text-4xl">star</span>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                Małe sygnały = wielki sukces
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
                <span className="material-icons text-3xl mb-2">directions_walk</span>
                <p className="font-medium">podejście bliżej</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
                <span className="material-icons text-3xl mb-2">hotel</span>
                <p className="font-medium">spanie obok</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
                <span className="material-icons text-3xl mb-2">graphic_eq</span>
                <p className="font-medium">mruczenie</p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
              <p className="text-xl font-medium italic">
                to znaczy: „już Ci ufam"
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--warm-coral)]/20 mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="material-icons text-5xl text-[var(--paw-orange)]">lightbulb</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--deep-brown)] mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
              Chcesz żeby kot Ci zaufał?
            </h2>
            <p className="text-xl text-[var(--soft-brown)] leading-relaxed">
              Nie rób wszystkiego „więcej" — rób to… <strong className="text-[var(--paw-orange)]">mądrzej</strong>.
            </p>
          </div>

          {/* Engagement */}
          <div className="bg-gradient-to-br from-[var(--muted-mauve)] to-[var(--gentle-rose)] rounded-3xl p-8 md:p-12 shadow-lg border border-[var(--warm-coral)]/20 mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[var(--deep-brown)] mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
                Podziel się swoimi doświadczeniami!
              </h2>
              <p className="text-xl text-[var(--deep-brown)] mb-6">
                Jak długo Twój kot się oswajał?
              </p>
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all">
                <span className="material-icons">comment</span>
                <span>Napisz komentarz</span>
              </button>
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center">
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