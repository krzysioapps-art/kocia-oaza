"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Cat {
  id: string;
  name: string;
  slug: string;
  gender: "male" | "female";
  status: "available" | "reserved" | "adopted";
  birth_date?: string | null;
  tags?: string[];
  good_with_children?: boolean;
  good_with_cats?: boolean;
  good_with_dogs?: boolean;
  fiv_status?: string;
  felv_status?: string;
  image_url?: string;
  short_description?: string;
}

type FilterKey = "all" | "male" | "female" | "children" | "cats" | "dogs" | "young" | "adult" | "senior";

export default function CatsPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [filteredCats, setFilteredCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set(["all"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      setIsLoading(true);

      const { data: catsData } = await supabase
        .from("cats")
        .select("*")
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
      setFilteredCats(catsWithImages);
      setIsLoading(false);
    };

    fetchCats();
  }, []);

  useEffect(() => {
    let result = [...cats];

    // Search query
    if (searchQuery.trim()) {
      result = result.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (!activeFilters.has("all") && activeFilters.size > 0) {
      result = result.filter((cat) => {
        const checks: boolean[] = [];

        if (activeFilters.has("male")) checks.push(cat.gender === "male");
        if (activeFilters.has("female")) checks.push(cat.gender === "female");
        if (activeFilters.has("children")) checks.push(cat.good_with_children === true);
        if (activeFilters.has("cats")) checks.push(cat.good_with_cats === true);
        if (activeFilters.has("dogs")) checks.push(cat.good_with_dogs === true);

        if (activeFilters.has("young") || activeFilters.has("adult") || activeFilters.has("senior")) {
          if (!cat.birth_date) {
            // Jeśli nie ma daty urodzenia, pomijamy filtry wiekowe
            return checks.some((check) => check === true);
          }

          const birth = new Date(cat.birth_date);
          const now = new Date();
          let years = now.getFullYear() - birth.getFullYear();
          let months = now.getMonth() - birth.getMonth();

          if (months < 0) {
            years--;
            months += 12;
          }

          const totalMonths = years * 12 + months;

          if (activeFilters.has("young")) {
            checks.push(totalMonths < 24);
          }
          if (activeFilters.has("adult")) {
            checks.push(totalMonths >= 24 && totalMonths < 84);
          }
          if (activeFilters.has("senior")) {
            checks.push(totalMonths >= 84);
          }
        }

        return checks.some((check) => check === true);
      });
    }

    setFilteredCats(result);
  }, [activeFilters, searchQuery, cats]);

  const toggleFilter = (filter: FilterKey) => {
    const newFilters = new Set(activeFilters);

    if (filter === "all") {
      setActiveFilters(new Set(["all"]));
      return;
    }

    newFilters.delete("all");

    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }

    if (newFilters.size === 0) {
      setActiveFilters(new Set(["all"]));
    } else {
      setActiveFilters(newFilters);
    }
  };

  const getAgeDisplay = (cat: Cat) => {
    if (!cat.birth_date) return "Brak danych";

    const birth = new Date(cat.birth_date);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    // < 1 rok
    if (years === 0) {
      return months <= 1 ? "1 miesiąc" : `${months} miesięcy`;
    }

    // >= 1 rok
    if (months === 0) {
      if (years === 1) return "1 rok";
      if (years < 5) return `${years} lata`;
      return `${years} lat`;
    }

    return `${years} ${years === 1 ? "rok" : years < 5 ? "lata" : "lat"} ${months} mies.`;
  };

  const filters = [
    { key: "all" as FilterKey, label: "Wszystkie", icon: "pets" },
    { key: "male" as FilterKey, label: "Kocury", icon: "male" },
    { key: "female" as FilterKey, label: "Kotki", icon: "female" },
    { key: "children" as FilterKey, label: "Dobre z dziećmi", icon: "child_care" },
    { key: "cats" as FilterKey, label: "Dobre z kotami", icon: "pets" },
    { key: "dogs" as FilterKey, label: "Dobre z psami", icon: "cruelty_free" },
    { key: "young" as FilterKey, label: "Młode (< 2 lat)", icon: "cake" },
    { key: "adult" as FilterKey, label: "Dorosłe (2-7 lat)", icon: "star" },
    { key: "senior" as FilterKey, label: "Seniorzy (7+ lat)", icon: "favorite" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4 text-center"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Koty czekające na dom
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl mx-auto opacity-95">
            {filteredCats.length} {filteredCats.length === 1 ? "kot czeka" : "kotów czeka"} na swoją szansę
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="sticky top-[80px] z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Szukaj po imieniu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:border-[var(--paw-orange)] focus:outline-none transition-colors text-sm"
              />
            </div>

            {/* Filter Toggle Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-gray-100 rounded-full font-medium text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="material-icons text-lg">tune</span>
                  <span>Filtry</span>
                  {!activeFilters.has("all") && activeFilters.size > 0 && (
                    <span className="bg-[var(--paw-orange)] text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFilters.size}
                    </span>
                  )}
                </span>
                <span className="material-icons text-lg">
                  {showFilters ? "expand_less" : "expand_more"}
                </span>
              </button>
            </div>

            {/* Filter Pills Desktop */}
            <div className="hidden md:flex flex-wrap gap-2">
              {filters.slice(0, 6).map((filter) => {
                const isActive = activeFilters.has(filter.key);
                return (
                  <button
                    key={filter.key}
                    onClick={() => toggleFilter(filter.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all text-sm ${isActive
                        ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <span className="material-icons text-base">{filter.icon}</span>
                    <span className="hidden lg:inline">{filter.label}</span>
                  </button>
                );
              })}

              {/* More filters dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <span className="material-icons text-base">more_horiz</span>
                  <span>Więcej</span>
                </button>

                {showMoreFilters && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMoreFilters(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 min-w-[200px] z-20">
                      {filters.slice(6).map((filter) => {
                        const isActive = activeFilters.has(filter.key);
                        return (
                          <button
                            key={filter.key}
                            onClick={() => {
                              toggleFilter(filter.key);
                              setShowMoreFilters(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm mb-1 last:mb-0 ${isActive
                                ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                              }`}
                          >
                            <span className="material-icons text-base">{filter.icon}</span>
                            <span>{filter.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Clear filters */}
              {!activeFilters.has("all") && activeFilters.size > 0 && (
                <button
                  onClick={() => setActiveFilters(new Set(["all"]))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all text-sm text-gray-500 hover:text-[var(--paw-orange)]"
                >
                  <span className="material-icons text-base">close</span>
                  <span className="hidden lg:inline">Wyczyść</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filter Pills */}
          {showFilters && (
            <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                  const isActive = activeFilters.has(filter.key);
                  return (
                    <button
                      key={filter.key}
                      onClick={() => toggleFilter(filter.key)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all text-sm ${isActive
                          ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white shadow-md"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      <span className="material-icons text-base">{filter.icon}</span>
                      <span>{filter.label}</span>
                    </button>
                  );
                })}
              </div>

              {!activeFilters.has("all") && activeFilters.size > 0 && (
                <button
                  onClick={() => {
                    setActiveFilters(new Set(["all"]));
                    setShowFilters(false);
                  }}
                  className="mt-3 w-full text-center text-sm text-[var(--paw-orange)] hover:underline font-medium"
                >
                  Wyczyść wszystkie filtry
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Cats Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse"
                >
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-6">
                    <div className="h-8 bg-gray-200 rounded mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCats.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-white text-6xl">search_off</span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-3">
                Nie znaleziono kotów
              </h3>
              <p className="text-[var(--text-medium)] mb-6">
                Spróbuj zmienić filtry lub wyszukiwanie
              </p>
              <button
                onClick={() => {
                  setActiveFilters(new Set(["all"]));
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--paw-orange)] text-white rounded-full font-bold hover:shadow-lg transition-all"
              >
                <span className="material-icons">refresh</span>
                <span>Reset filtrów</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCats.map((cat, index) => (
                <Link
                  key={cat.id}
                  href={`/koty/${cat.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s backwards`,
                  }}
                >
                  {/* Image */}
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-[var(--warm-cream)] to-[var(--soft-peach)]">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-icons text-gray-300 text-8xl">
                          pets
                        </span>
                      </div>
                    )}

                    {/* Gender Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                      <span
                        className={`material-icons text-2xl ${cat.gender === "male"
                            ? "text-blue-500"
                            : "text-pink-500"
                          }`}
                      >
                        {cat.gender === "male" ? "male" : "female"}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-2 ${cat.status === "available"
                            ? "bg-green-500 text-white"
                            : cat.status === "reserved"
                              ? "bg-yellow-400 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${cat.status === "available"
                              ? "bg-green-200"
                              : cat.status === "reserved"
                                ? "bg-yellow-200"
                                : "bg-gray-200"
                            }`}
                        />
                        {cat.status === "available"
                          ? "Szuka domu"
                          : cat.status === "reserved"
                            ? "W trakcie adopcji"
                            : "Ma już dom"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-2 group-hover:text-[var(--paw-orange)] transition-colors">
                      {cat.name}
                    </h3>

                    <div className="flex items-center gap-2 text-[var(--text-medium)] mb-4">
                      <span className="material-icons text-sm">cake</span>
                      <span className="text-sm font-medium">
                        {getAgeDisplay(cat)}
                      </span>
                    </div>

                    {/* Tags */}
                    {cat.tags && cat.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {cat.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gradient-to-r from-[var(--warm-coral)]/10 to-[var(--paw-orange)]/10 text-[var(--paw-orange)] text-xs font-bold rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick Info Icons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      {cat.good_with_children && (
                        <div
                          className="flex items-center gap-1 text-green-600"
                          title="Dobre z dziećmi"
                        >
                          <span className="material-icons text-sm">
                            child_care
                          </span>
                        </div>
                      )}
                      {cat.good_with_cats && (
                        <div
                          className="flex items-center gap-1 text-green-600"
                          title="Dobre z kotami"
                        >
                          <span className="material-icons text-sm">pets</span>
                        </div>
                      )}
                      {cat.good_with_dogs && (
                        <div
                          className="flex items-center gap-1 text-green-600"
                          title="Dobre z psami"
                        >
                          <span className="material-icons text-sm">
                            cruelty_free
                          </span>
                        </div>
                      )}

                      <div className="ml-auto">
                        <span className="inline-flex items-center gap-1 text-[var(--paw-orange)] font-bold group-hover:gap-2 transition-all">
                          <span className="text-sm">Zobacz profil</span>
                          <span className="material-icons text-sm">
                            arrow_forward
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isLoading && filteredCats.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-[var(--soft-peach)] to-[var(--warm-cream)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-3xl md:text-5xl font-bold text-[var(--text-dark)] mb-4"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Znalazłeś swojego przyjaciela?
            </h2>
            <p className="text-lg md:text-xl text-[var(--text-medium)] mb-8">
              Zobacz jak wygląda proces adopcji i rozpocznij swoją przygodę
            </p>
            <Link
              href="/jak-adoptowac"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <span>Jak adoptować?</span>
              <span className="material-icons">arrow_forward</span>
            </Link>
          </div>
        </section>
      )}

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