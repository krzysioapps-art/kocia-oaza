"use client";

import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useEffect, useState, useMemo } from "react";
import { optimizeCloudinaryUrl, getBlurDataURL } from "@/lib/cloudinary";
import {
  SearchIcon,
  ChildCareIcon,
  PetsIcon,
  ArrowForwardIcon,
  FavoriteIcon,
  SentimentDissatisfiedIcon,
} from "@/components/Icons";

interface Cat {
  id: string;
  name: string;
  slug: string;
  gender: string;
  tags: string[] | null;
  good_with_children: boolean;
  good_with_cats: boolean;
  status: string;
  cat_media: { url: string }[];
  image_url?: string | null;
}

export default function CatsListPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [goodWithChildren, setGoodWithChildren] = useState(false);
  const [goodWithCats, setGoodWithCats] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    setIsLoading(true);

    try {
      // FIXED: Single query with join instead of N+1
      const { data: catsData, error } = await supabase
        .from("cats")
        .select(`
          id,
          name,
          slug,
          gender,
          tags,
          good_with_children,
          good_with_cats,
          status,
          cat_media!inner(url, is_primary)
        `)
        .eq("status", "available")
        .eq("cat_media.is_primary", true)
        .is("deleted_at", null);

      if (error) throw error;

      // Transform data to match expected structure
      const transformedCats: Cat[] = (catsData || []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        gender: cat.gender,
        tags: cat.tags,
        good_with_children: cat.good_with_children,
        good_with_cats: cat.good_with_cats,
        status: cat.status,
        cat_media: cat.cat_media || [],
        image_url: cat.cat_media?.[0]?.url || null,
      }));

      setCats(transformedCats);
    } catch (error) {
      console.error("Error fetching cats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilter = (tag: string) => {
    setFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // OPTIMIZED: Memoized filtering to prevent unnecessary recalculations
  const filteredCats = useMemo(() => {
    return cats.filter((cat) => {
      if (filters.length > 0) {
        const hasAllTags = filters.every((f) => cat.tags?.includes(f));
        if (!hasAllTags) return false;
      }
      if (goodWithChildren && !cat.good_with_children) return false;
      if (goodWithCats && !cat.good_with_cats) return false;
      return true;
    });
  }, [cats, filters, goodWithChildren, goodWithCats]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-[var(--soft-peach)] via-[var(--muted-mauve)] to-[var(--gentle-rose)] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--deep-brown)] mb-4 font-display">
            Koty do adopcji
          </h1>
          <p className="text-lg md:text-xl text-[var(--soft-brown)] max-w-2xl mx-auto">
            Znajdź swojego idealnego mruczącego przyjaciela
          </p>
        </div>
      </section>

      {/* Filter & Cats Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-12">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-6 md:p-8 shadow-lg border border-[var(--warm-coral)]/20">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--deep-brown)] mb-6 flex items-center gap-3 font-display">
                <SearchIcon size={28} />
                Znajdź idealnego kotka
              </h2>

              <div className="space-y-6">
                {/* Tag filters */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--soft-brown)] mb-3">
                    Temperament
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {["spokojny", "aktywny", "miziasty", "jedynak", "towarzyski", "nieśmiały"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleFilter(tag)}
                        className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                          filters.includes(tag)
                            ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white shadow-lg scale-105"
                            : "bg-white border-2 border-[var(--warm-coral)]/30 text-[var(--deep-brown)] hover:border-[var(--warm-coral)] hover:shadow-md"
                        }`}
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Boolean filters */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--soft-brown)] mb-3">
                    Dodatkowe preferencje
                  </label>
                  <div className="flex gap-6 flex-wrap">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={goodWithChildren}
                          onChange={() => setGoodWithChildren(!goodWithChildren)}
                          className="peer sr-only"
                        />
                        <div className="w-12 h-6 bg-gray-200 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-[var(--warm-coral)] peer-checked:to-[var(--paw-orange)] transition-all"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md"></div>
                      </div>
                      <span className="font-medium text-[var(--deep-brown)] group-hover:text-[var(--paw-orange)] transition-colors flex items-center gap-1">
                        Dla dzieci
                        <ChildCareIcon />
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={goodWithCats}
                          onChange={() => setGoodWithCats(!goodWithCats)}
                          className="peer sr-only"
                        />
                        <div className="w-12 h-6 bg-gray-200 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-[var(--warm-coral)] peer-checked:to-[var(--paw-orange)] transition-all"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md"></div>
                      </div>
                      <span className="font-medium text-[var(--deep-brown)] group-hover:text-[var(--paw-orange)] transition-colors flex items-center gap-1">
                        Z innymi kotami
                        <PetsIcon />
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Active filters summary */}
              {(filters.length > 0 || goodWithChildren || goodWithCats) && (
                <div className="mt-6 pt-6 border-t border-[var(--warm-coral)]/20">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="text-sm text-[var(--soft-brown)]">
                      Znaleziono: <span className="font-bold text-[var(--paw-orange)] text-lg">{filteredCats.length}</span>{" "}
                      {filteredCats.length === 1 ? "kotek" : "kotków"}
                    </div>
                    <button
                      onClick={() => {
                        setFilters([]);
                        setGoodWithChildren(false);
                        setGoodWithCats(false);
                      }}
                      className="text-sm text-[var(--soft-brown)] hover:text-[var(--paw-orange)] underline transition-colors"
                    >
                      Wyczyść filtry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cats Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-3xl mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredCats.length === 0 ? (
            <div className="text-center py-16">
              <SentimentDissatisfiedIcon size={64} />
              <h3 className="text-2xl font-bold text-[var(--deep-brown)] mb-2 mt-4 font-display">
                Nie znaleziono kotków
              </h3>
              <p className="text-[var(--soft-brown)]">Spróbuj zmienić kryteria wyszukiwania</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredCats.map((cat, index) => (
                <Link
                  key={cat.id}
                  href={`/koty/${cat.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[var(--warm-coral)]/10"
                >
                  <div className="relative overflow-hidden">
                    {cat.image_url ? (
                      <Image
                        src={optimizeCloudinaryUrl(cat.image_url, { width: 400, height: 400, quality: 'auto', format: 'auto' })}
                        alt={cat.name}
                        width={400}
                        height={400}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading={index < 6 ? "eager" : "lazy"}
                        placeholder="blur"
                        blurDataURL={getBlurDataURL(cat.image_url)}
                      />
                    ) : (
                      <div className="h-64 bg-gradient-to-br from-[var(--soft-peach)] to-[var(--gentle-rose)] flex items-center justify-center">
                        <PetsIcon size={64} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-[var(--deep-brown)] shadow-lg flex items-center gap-1">
                      <FavoriteIcon />
                      {cat.gender === "female" ? "Kotka" : cat.gender === "male" ? "Kocur" : "Kot"}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-2xl font-bold text-[var(--deep-brown)] mb-2 group-hover:text-[var(--paw-orange)] transition-colors font-display">
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
                        {cat.good_with_children && <ChildCareIcon />}
                        {cat.good_with_cats && <PetsIcon />}
                      </div>
                      <span className="text-[var(--paw-orange)] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Zobacz więcej
                        <ArrowForwardIcon />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}