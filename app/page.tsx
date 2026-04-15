"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import UpdatesTeaser from "@/components/UpdatesTeaser";

export default function Home() {
  const [cats, setCats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const MotionLink = motion(Link);
  useEffect(() => {
    const fetchCats = async () => {
      setIsLoading(true);

      const { data: catsData } = await supabase
        .from("cats")
        .select("id, name, slug, gender, tags, good_with_children, good_with_cats")
        .eq("status", "available")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(4);

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
    <div className="min-h-screen overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">

        {/* Background */}
        <div className="absolute inset-0">
          {/* Mobile */}
          <div
            className="absolute inset-0 bg-cover bg-center md:hidden"
            style={{ backgroundImage: "url('/images/hero-bg-mobile.webp')" }}
          />
          {/* Desktop */}
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-bg.webp')" }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Gradient fade bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.25) 40%, rgba(255,248,240,0.6) 80%, var(--warm-cream) 100%)",
            }}
          />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <motion.div
            className="max-w-4xl text-center flex flex-col items-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >

            {/* HEADLINE */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
              style={{
                fontFamily: "'Caveat', cursive",
                textShadow: "0 4px 25px rgba(0,0,0,0.5)",
              }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
            >
              Ratujemy koty. Pomóż im znaleźć dom.
            </motion.h1>

            {/* SUBTEXT */}
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-10 max-w-2xl leading-relaxed"
              style={{ textShadow: "0 2px 15px rgba(0,0,0,0.4)" }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
            >
              Każdy z nich ma swoją historię. Teraz szuka bezpiecznego domu.
            </motion.p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">

              {/* PRIMARY BUTTON */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  href="/koty"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-semibold text-base shadow-lg hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
                >
                  <span>Poznaj koty do adopcji</span>
                  <span className="material-icons text-xl">pets</span>
                </Link>
              </motion.div>

              {/* SECONDARY BUTTON (delayed) */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link
                  href="/jak-pomagamy"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/90 backdrop-blur-md text-[var(--deep-brown)] rounded-full font-semibold text-base shadow-lg hover:bg-white hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
                >
                  <span>Jak pomagamy</span>
                  <span className="material-icons text-xl">arrow_forward</span>
                </Link>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* STORY TEASER */}
      <section className="py-16 md:py-20 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--deep-brown)] mb-6"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Każdy kot ma swoją historię
          </h2>

          <p className="text-lg md:text-xl text-[var(--soft-brown)] mb-8 max-w-2xl mx-auto leading-relaxed">
            Niektóre trafiają do nas po wypadkach. Inne całe życie spędziły na ulicy. Każdemu dajemy szansę na nowy początek.
          </p>

          <Link
            href="/o-nas"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[var(--paw-orange)] text-white rounded-full font-semibold text-base hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <span>Poznaj nasze historie</span>
            <span className="material-icons text-xl">auto_stories</span>
          </Link>
        </div>
      </section>

      {/* HELP TEASER */}
      <section className="py-16 md:py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--deep-brown)] mb-12 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Jak pomagamy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "emergency",
                title: "Ratowanie",
                description: "Przyjmujemy koty chore i bezdomne",
              },
              {
                icon: "medical_services",
                title: "Leczenie",
                description: "Diagnostyka, leczenie i opieka",
              },
              {
                icon: "health_and_safety",
                title: "Kastracje",
                description: "Ograniczamy bezdomność",
              },
              {
                icon: "favorite",
                title: "Adopcje",
                description: "Szukamy odpowiednich domów",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-xl flex items-center justify-center mb-4">
                  <span className="material-icons text-white text-2xl">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--deep-brown)] mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--soft-brown)] text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/jak-pomagamy"
              className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-semibold text-base hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <span>Zobacz jak pomagamy</span>
              <span className="material-icons text-xl">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CATS PREVIEW */}
      <section className="py-16 md:py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold text-[var(--deep-brown)] mb-4"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Poznaj koty, którym szukamy domu
            </h2>
            <p className="text-lg md:text-xl text-[var(--soft-brown)]">
              Każdy z nich jest gotowy na nowy rozdział.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/50 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cats.map((cat, index) => (
                <MotionLink
                  key={cat.id}
                  href={`/koty/${cat.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-icons text-gray-300 text-6xl">
                          pets
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-[var(--soft-brown)] text-sm">
                      {cat.gender === "male" ? "Kotek" : "Kotka"}
                    </p>
                  </div>
                </MotionLink>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/koty"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[var(--paw-orange)] text-white rounded-full font-semibold text-base hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <span>Zobacz wszystkie koty</span>
              <span className="material-icons text-xl">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* UPDATES TEASER */}
      <section className="py-16 md:py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold text-[var(--deep-brown)] mb-4"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Co u nas nowego
            </h2>
            <p className="text-lg md:text-xl text-[var(--soft-brown)]">
              Zobacz najnowsze historie i aktualizacje naszych podopiecznych
            </p>
          </div>

          <UpdatesTeaser />

          <div className="text-center mt-10">
            <Link
              href="/aktualnosci"
              className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-semibold text-base hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <span>Zobacz wszystkie aktualności</span>
              <span className="material-icons text-xl">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* WAYS TO HELP */}
      <section className="py-16 md:py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--deep-brown)] mb-12 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Możesz pomóc na kilka sposobów
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "home",
                title: "Adoptuj",
                description: "Daj kotu dom na stałe",
                cta: "Zobacz koty",
                link: "/koty",
                color: "from-[var(--warm-coral)] to-[var(--paw-orange)]",
              },
              {
                icon: "schedule",
                title: "Dom tymczasowy",
                description: "Pomóż kotu dojść do siebie zanim znajdzie dom",
                cta: "Dowiedz się więcej",
                link: "/jak-pomagamy",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: "volunteer_activism",
                title: "Wesprzyj",
                description: "Pomóż nam ratować kolejne koty",
                cta: "Wesprzyj nas",
                link: "/jak-pomagamy",
                color: "from-blue-500 to-cyan-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <span className="material-icons text-white text-3xl">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--soft-brown)] mb-4 leading-relaxed text-sm">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${item.color} text-white rounded-full font-semibold text-sm hover:shadow-md hover:scale-[1.02] transition-all`}
                >
                  <span>{item.cta}</span>
                  <span className="material-icons text-base">arrow_forward</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="py-16 md:py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--deep-brown)] mb-12 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Warto wiedzieć
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Jak zdobyć zaufanie kota",
                icon: "favorite_border",
              },
              {
                title: "Pierwsze dni kota w domu",
                icon: "home_work",
              },
              {
                title: "Czego nie robić",
                icon: "warning_amber",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-icons text-white text-xl">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--deep-brown)] group-hover:text-[var(--paw-orange)] transition-colors">
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/porady"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[var(--paw-orange)] text-white rounded-full font-semibold text-base hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <span>Zobacz wszystkie porady</span>
              <span className="material-icons text-xl">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ADOPTION STEPS */}
      <section className="py-16 md:py-20 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--deep-brown)] mb-12 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Jak wygląda adopcja?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-14 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--warm-coral)] via-[var(--paw-orange)] to-[var(--warm-coral)] opacity-20" />

            {[
              {
                number: "1",
                title: "Formularz",
                description: "Wypełniasz zgłoszenie",
                icon: "edit_note",
              },
              {
                number: "2",
                title: "Poznanie",
                description: "Spotykasz kota",
                icon: "handshake",
              },
              {
                number: "3",
                title: "Adopcja",
                description: "Podpisujemy umowę",
                icon: "task_alt",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="relative inline-block mb-4">
                  <div className="w-28 h-28 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-full flex items-center justify-center shadow-lg relative z-10">
                    <span className="material-icons text-white text-4xl">
                      {step.icon}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md z-20 border-3 border-[var(--background)]">
                    <span className="text-xl font-bold text-[var(--paw-orange)]">
                      {step.number}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[var(--deep-brown)] mb-1">
                  {step.title}
                </h3>
                <p className="text-[var(--soft-brown)]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/jak-adoptowac"
              className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-semibold text-base hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <span>Zobacz szczegóły</span>
              <span className="material-icons text-xl">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Każdy kot zasługuje na dom
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-95 leading-relaxed">
            Możesz pomóc — na swój sposób.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/koty"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white text-[var(--paw-orange)] rounded-full font-semibold text-base hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <span>Poznaj koty</span>
              <span className="material-icons text-xl">pets</span>
            </Link>

            <Link
              href="/jak-pomagamy"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-full font-semibold text-base hover:bg-white/30 hover:shadow-lg transition-all"
            >
              <span>Zobacz jak pomagamy</span>
              <span className="material-icons text-xl">volunteer_activism</span>
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}