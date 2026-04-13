import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
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
            Polityka prywatności
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-95">
            Ochrona Twoich danych osobowych
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="bg-white/80 backdrop-blur rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--warm-coral)]/20 space-y-8">
          
          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2">
              <span className="material-icons text-[var(--paw-orange)]">info</span>
              1. Informacje ogólne
            </h2>
            <p className="text-[var(--deep-brown)] leading-relaxed">
              Strona „Kocia Oaza" służy prezentacji kotów do adopcji oraz umożliwia kontakt i przesyłanie zgłoszeń adopcyjnych.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2">
              <span className="material-icons text-[var(--paw-orange)]">admin_panel_settings</span>
              2. Administrator danych
            </h2>
            <p className="text-[var(--deep-brown)] leading-relaxed mb-2">
              Administratorem danych osobowych jest:
            </p>
            <div className="bg-gradient-to-r from-[var(--soft-peach)] to-[var(--gentle-rose)] p-4 rounded-xl">
              <p className="font-semibold text-[var(--deep-brown)]">Malwina Gryczan</p>
              <p className="text-sm text-[var(--soft-brown)]">(inicjatywa „Stowarzyszenie Kocia Oaza Koci Raj")</p>
              <p className="text-sm text-[var(--soft-brown)] mt-2">
                E-mail: <a href="mailto:kocia.oaza@gmail.com" className="text-[var(--paw-orange)] hover:underline">kocia.oaza@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2">
              <span className="material-icons text-[var(--paw-orange)]">storage</span>
              3. Zakres zbieranych danych
            </h2>
            <p className="text-[var(--deep-brown)] leading-relaxed mb-3">
              W ramach formularza adopcyjnego mogą być zbierane następujące dane:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--deep-brown)] ml-4">
              <li>imię i nazwisko</li>
              <li>adres e-mail</li>
              <li>numer telefonu</li>
              <li>informacje o warunkach mieszkaniowych</li>
              <li>informacje dotyczące doświadczenia z kotami</li>
            </ul>
            <p className="text-[var(--deep-brown)] leading-relaxed mt-3">
              Podanie danych jest dobrowolne, ale niezbędne do przeprowadzenia procesu adopcji.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2">
              <span className="material-icons text-[var(--paw-orange)]">track_changes</span>
              4. Cel przetwarzania danych
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[var(--deep-brown)] ml-4">
              <li>przeprowadzenie procesu adopcji kota</li>
              <li>kontakt z osobą zainteresowaną adopcją</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2">
              <span className="material-icons text-[var(--paw-orange)]">gavel</span>
              5. Podstawa przetwarzania danych
            </h2>
            <p className="text-[var(--deep-brown)] leading-relaxed">
              Dane przetwarzane są na podstawie zgody użytkownika (art. 6 ust. 1 lit. a RODO).
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2">
              <span className="material-icons text-[var(--paw-orange)]">schedule</span>
              6. Okres przechowywania danych
            </h2>
            <p className="text-[var(--deep-brown)] leading-relaxed">
              Dane są przechowywane przez czas niezbędny do przeprowadzenia procesu adopcji, nie dłużej niż 12 miesięcy od momentu ich przekazania.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2">
              <span className="material-icons text-[var(--paw-orange)]">group</span>
              7. Odbiorcy danych
            </h2>
            <p className="text-[var(--deep-brown)] leading-relaxed mb-3">
              Dane mogą być udostępniane wyłącznie osobom zaangażowanym w proces adopcji (np. wolontariuszom współpracującym z inicjatywą „Kocia Oaza").
            </p>
            <p className="text-[var(--deep-brown)] leading-relaxed">
              Dane mogą być również przechowywane w systemach informatycznych wykorzystywanych do obsługi formularza oraz funkcjonowania strony.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2">
              <span className="material-icons text-[var(--paw-orange)]">verified_user</span>
              8. Prawa użytkownika
            </h2>
            <p className="text-[var(--deep-brown)] leading-relaxed mb-3">
              Użytkownik ma prawo do:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--deep-brown)] ml-4">
              <li>dostępu do swoich danych</li>
              <li>ich poprawienia</li>
              <li>usunięcia</li>
              <li>ograniczenia przetwarzania</li>
              <li>wycofania zgody w dowolnym momencie</li>
            </ul>
            <p className="text-[var(--deep-brown)] leading-relaxed mt-3">
              Wycofanie zgody możliwe jest poprzez kontakt z administratorem drogą mailową.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2">
              <span className="material-icons text-[var(--paw-orange)]">cookie</span>
              9. Pliki cookies
            </h2>
            <p className="text-[var(--deep-brown)] leading-relaxed mb-3">
              Strona może wykorzystywać pliki cookies w celach technicznych, związanych z prawidłowym działaniem serwisu.
            </p>
            <p className="text-[var(--deep-brown)] leading-relaxed">
              W przypadku korzystania z narzędzi analitycznych lub zewnętrznych usług (np. statystyk odwiedzin), mogą być wykorzystywane dodatkowe pliki cookies zbierające anonimowe dane dotyczące korzystania ze strony.
            </p>
          </div>

          {/* Section 10 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2">
              <span className="material-icons text-[var(--paw-orange)]">lock</span>
              10. Zabezpieczenie danych
            </h2>
            <p className="text-[var(--deep-brown)] leading-relaxed">
              Administrator dokłada starań, aby zapewnić odpowiednie środki ochrony danych osobowych.
            </p>
          </div>

          {/* Section 11 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--deep-brown)] mb-4 flex items-center gap-2">
              <span className="material-icons text-[var(--paw-orange)]">update</span>
              11. Zmiany polityki
            </h2>
            <p className="text-[var(--deep-brown)] leading-relaxed">
              Polityka prywatności może być aktualizowana w przypadku zmian na stronie lub w sposobie przetwarzania danych.
            </p>
          </div>

        </div>

        {/* Contact */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span className="material-icons">contact_support</span>
            Pytania?
          </h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            W razie pytań dotyczących polityki prywatności, skontaktuj się z nami: <a href="mailto:kocia.oaza@gmail.com" className="font-semibold hover:underline">kocia.oaza@gmail.com</a>
          </p>
        </div>

        {/* Back button */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <span className="material-icons">arrow_back</span>
            <span>Wróć do strony głównej</span>
          </Link>
        </div>
      </div>
    </div>
  );
}