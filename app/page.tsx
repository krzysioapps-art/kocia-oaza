"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useRef, useState } from "react";
import { CatRow } from "@/components/CatRow";

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
  const [catsCount, setCatsCount] = useState(0);

  useEffect(() => {
    const fetchCats = async () => {
      setIsLoading(true);

      const { count } = await supabase
        .from("cats")
        .select("*", { count: "exact", head: true })
        .eq("status", "available")
        .is("deleted_at", null);

      setCatsCount(count || 0);

      const { data: catsData } = await supabase
        .from("cats")
        .select("id, name, slug, gender, tags, good_with_children, good_with_cats, fiv_status, felv_status")
        .eq("status", "available")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

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
      {/* Hero Section z ilustracją */}
      {/* Hero Section z ilustracją */}
      <section className="relative overflow-hidden min-h-[100vh] md:min-h-[100vh] flex items-center -mt-[80px] pt-[80px]">
        {/* Ilustracja jako tło */}
        <div className="absolute inset-0">
          {/* mobile */}
          <div
            className="absolute inset-0 bg-cover bg-bottom md:hidden"
            style={{
              backgroundImage: "url('/images/hero-bg-mobile.webp')",
            }}
          />

          {/* desktop */}
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-bottom"
            style={{
              backgroundImage: "url('/images/hero-bg.webp')",
            }}
          />
        </div>

        {/* lekki dark dla tekstu */}
        <div className="absolute inset-0 bg-black/20" />

        {/* właściwy blend do sekcji */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)] to-95%" />
        {/* Paw pattern delikatnie */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Dodaj białe tło pod tekstem dla czytelności */}

          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Znajdź swojego<br />
            <span className="text-[var(--paw-orange)]">mruczącego przyjaciela</span>
          </h1>

          <p className="text-base md:text-lg text-white/90 font-semibold max-w-2xl mx-auto mb-6 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            Każdy z naszych kotków czeka na dom pełen miłości
          </p>

          <div className="mt-12 text-center">
            <Link
              href="/jak-adoptowac"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <span>Jak adoptować?</span>
              <span className="material-icons">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>


      {/* Cat Rows Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="page-container">

          <>
            <div className="relative -mt-[14rem] mb-8 z-30">
              <CatRow
                title="Nowe koty"
                cats={cats.slice(0, 15)}
                rowId={2}
                isLoading={isLoading}
              />
            </div>

            <CatRow
              title="Idealne dla rodzin"
              cats={cats.filter(c => c.good_with_children)}
              rowId={3}
              isLoading={isLoading}
            />

            <CatRow
              title="Dobrze z innymi kotami"
              cats={cats.filter(c => c.good_with_cats)}
              rowId={4}
              isLoading={isLoading}
            />

            <CatRow
              title="Miziasty"
              cats={cats.filter(c => c.tags?.includes("miziasty"))}
              rowId={5}
              isLoading={isLoading}
            />

            <CatRow
              title="Spokojne duszki"
              cats={cats.filter(c => c.tags?.includes("spokojny"))}
              rowId={6}
              isLoading={isLoading}
            />
          </>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] text-white relative overflow-hidden">
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
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[var(--paw-orange)] rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
          >
            <span className="material-icons">arrow_upward</span>
            <span>Wróć na górę</span>
          </button>
        </div>
      </section>
    </div>
  );
}