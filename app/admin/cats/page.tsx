"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

interface Cat {
  id: string;
  name: string;
  gender: string;
  status: string;
  location: string | null;
  tags: string[] | null;
  sterilized: boolean;
  vaccinated: boolean;
  dewormed: boolean;
  good_with_cats: boolean;
  good_with_children: boolean;
  slug: string;
  cat_media?: { url: string; is_primary: boolean }[];
  image_url?: string | null;
}

const statusStyles = {
  available: "status-available",
  reserved: "status-reserved",
  adopted: "status-adopted",
} as const;

const statusLabels = {
  available: "Dostępny",
  reserved: "Zarezerwowany",
  adopted: "Adoptowany",
} as const;

export default function CatsListPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    setLoading(true);
    try {
      // Optimized query with join
      const { data, error } = await supabase
        .from("cats")
        .select(`
          *,
          cat_media!left(url, is_primary)
        `)
        .eq("cat_media.is_primary", true)
        .is("deleted_at", null)
        .order("name");

      if (error) throw error;

      const catsWithImages = (data || []).map((cat: any) => ({
        ...cat,
        image_url: cat.cat_media?.[0]?.url || null,
      }));

      setCats(catsWithImages);
    } catch (error) {
      console.error("Error fetching cats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtering and sorting
  const filteredCats = useMemo(() => {
    let result = [...cats];

    // Search filter
    if (searchQuery) {
      result = result.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((cat) => cat.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return result;
  }, [cats, searchQuery, statusFilter, sortBy]);

  const toggleStatus = useCallback(async (cat: Cat) => {
    const statusCycle: Record<string, string> = {
      available: "reserved",
      reserved: "adopted",
      adopted: "available",
    };

    const newStatus = statusCycle[cat.status] || "available";

    try {
      const { error } = await supabase
        .from("cats")
        .update({ status: newStatus })
        .eq("id", cat.id);

      if (error) throw error;

      setCats((prevCats) =>
        prevCats.map((c) => (c.id === cat.id ? { ...c, status: newStatus } : c))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Błąd podczas aktualizacji statusu");
    }
  }, []);

  const deleteCat = useCallback(async (catId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tego kota?")) return;

    try {
      const { error } = await supabase
        .from("cats")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", catId);

      if (error) throw error;

      setCats((prevCats) => prevCats.filter((c) => c.id !== catId));
    } catch (error) {
      console.error("Error deleting cat:", error);
      alert("Błąd podczas usuwania kota");
    }
  }, []);

  const getStatusBadge = (status: string) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status as keyof typeof statusStyles] || ""}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const stats = useMemo(() => ({
    total: cats.length,
    available: cats.filter((c) => c.status === "available").length,
    reserved: cats.filter((c) => c.status === "reserved").length,
    adopted: cats.filter((c) => c.status === "adopted").length,
  }), [cats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-12 w-12 text-[var(--paw-orange)]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Actions Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Szukaj po nazwie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
          >
            <option value="all">Wszystkie statusy</option>
            <option value="available">Dostępne</option>
            <option value="reserved">Zarezerwowane</option>
            <option value="adopted">Adoptowane</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent"
          >
            <option value="name">Sortuj: Nazwa</option>
            <option value="status">Sortuj: Status</option>
          </select>
        </div>

        <Link
          href="/admin/cats/new"
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Dodaj kota
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Wszystkie</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-700 mb-1">Dostępne</p>
          <p className="text-2xl font-bold text-green-700">{stats.available}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <p className="text-sm text-yellow-700 mb-1">Zarezerwowane</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.reserved}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <p className="text-sm text-purple-700 mb-1">Adoptowane</p>
          <p className="text-2xl font-bold text-purple-700">{stats.adopted}</p>
        </div>
      </div>

      {/* Cats Grid */}
      {filteredCats.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.5 9.5m0 5.5A3.5 3.5 0 1 0 4.5 8.5a3.5 3.5 0 1 0 0 7zm15 0A3.5 3.5 0 1 0 19.5 8.5a3.5 3.5 0 1 0 0 7z" />
          </svg>
          <p className="text-gray-500">Nie znaleziono kotów</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCats.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                {cat.image_url ? (
                  <Image
                    src={optimizeCloudinaryUrl(cat.image_url, { width: 400, height: 300, quality: 'auto', format: 'auto' })}
                    alt={cat.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.5 9.5m0 5.5A3.5 3.5 0 1 0 4.5 8.5a3.5 3.5 0 1 0 0 7zm15 0A3.5 3.5 0 1 0 19.5 8.5a3.5 3.5 0 1 0 0 7z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-3 right-3">{getStatusBadge(cat.status)}</div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      {cat.gender === "female" ? (
                        <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      ) : (
                        <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      )}
                    </svg>
                    {cat.gender === "female" ? "Kotka" : "Kocur"}
                  </span>
                  {cat.location && (
                    <span className="flex items-center gap-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      {cat.location}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {cat.tags && cat.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {cat.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Health Icons */}
                <div className="flex gap-2 mb-4">
                  {cat.sterilized && (
                    <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <title>Wysterylizowany</title>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  )}
                  {cat.vaccinated && (
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <title>Zaszczepiony</title>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  )}
                  {cat.good_with_children && (
                    <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                      <title>Dla dzieci</title>
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                  {cat.good_with_cats && (
                    <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                      <title>Z innymi kotami</title>
                      <path d="M4.5 9.5m0 5.5A3.5 3.5 0 1 0 4.5 8.5a3.5 3.5 0 1 0 0 7zm15 0A3.5 3.5 0 1 0 19.5 8.5a3.5 3.5 0 1 0 0 7z" />
                    </svg>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/cats/${cat.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                    Edytuj
                  </Link>
                  <button
                    onClick={() => toggleStatus(cat)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    title="Zmień status"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                    </svg>
                    Status
                  </button>
                  <button
                    onClick={() => deleteCat(cat.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Usuń"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}