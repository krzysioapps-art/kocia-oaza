"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  image_url: string | null;
  slug: string;
}

export default function CatsListPage() {
  const router = useRouter();
  const [cats, setCats] = useState<Cat[]>([]);
  const [filteredCats, setFilteredCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchCats();
  }, []);

  useEffect(() => {
    filterAndSortCats();
  }, [cats, searchQuery, statusFilter, sortBy]);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cats")
        .select("*")
        .is("deleted_at", null)
        .order("name");

      if (error) throw error;

      // Fetch primary images for each cat
      const catsWithImages = await Promise.all(
        (data || []).map(async (cat) => {
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
    } catch (error) {
      console.error("Error fetching cats:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCats = () => {
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

    setFilteredCats(result);
  };

  const toggleStatus = async (cat: Cat) => {
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

      // Update local state
      setCats(cats.map((c) => (c.id === cat.id ? { ...c, status: newStatus } : c)));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Błąd podczas aktualizacji statusu");
    }
  };

  const deleteCat = async (catId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tego kota?")) return;

    try {
      const { error } = await supabase
        .from("cats")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", catId);

      if (error) throw error;

      setCats(cats.filter((c) => c.id !== catId));
    } catch (error) {
      console.error("Error deleting cat:", error);
      alert("Błąd podczas usuwania kota");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      available: "bg-green-100 text-green-700 border-green-200",
      reserved: "bg-yellow-100 text-yellow-700 border-yellow-200",
      adopted: "bg-purple-100 text-purple-700 border-purple-200",
    };

    const labels: Record<string, string> = {
      available: "Dostępny",
      reserved: "Zarezerwowany",
      adopted: "Adoptowany",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || ""}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-icons animate-spin text-6xl text-[var(--paw-orange)]">refresh</span>
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
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
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
          <span className="material-icons">add</span>
          Dodaj kota
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Wszystkie</p>
          <p className="text-2xl font-bold text-gray-900">{cats.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-700 mb-1">Dostępne</p>
          <p className="text-2xl font-bold text-green-700">
            {cats.filter((c) => c.status === "available").length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <p className="text-sm text-yellow-700 mb-1">Zarezerwowane</p>
          <p className="text-2xl font-bold text-yellow-700">
            {cats.filter((c) => c.status === "reserved").length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <p className="text-sm text-purple-700 mb-1">Adoptowane</p>
          <p className="text-2xl font-bold text-purple-700">
            {cats.filter((c) => c.status === "adopted").length}
          </p>
        </div>
      </div>

      {/* Cats Grid */}
      {filteredCats.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <span className="material-icons text-6xl text-gray-300 mb-4">pets</span>
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
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-icons text-6xl text-gray-300">pets</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">{getStatusBadge(cat.status)}</div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <span className="material-icons text-sm">
                      {cat.gender === "female" ? "female" : "male"}
                    </span>
                    {cat.gender === "female" ? "Kotka" : "Kocur"}
                  </span>
                  {cat.location && (
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">location_on</span>
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
                    <span className="material-icons text-sm text-green-600" title="Wysterylizowany">
                      check_circle
                    </span>
                  )}
                  {cat.vaccinated && (
                    <span className="material-icons text-sm text-blue-600" title="Zaszczepiony">
                      vaccines
                    </span>
                  )}
                  {cat.good_with_children && (
                    <span className="material-icons text-sm text-purple-600" title="Dla dzieci">
                      child_care
                    </span>
                  )}
                  {cat.good_with_cats && (
                    <span className="material-icons text-sm text-orange-600" title="Z innymi kotami">
                      pets
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/cats/${cat.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <span className="material-icons text-sm">edit</span>
                    Edytuj
                  </Link>
                  <button
                    onClick={() => toggleStatus(cat)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    title="Zmień status"
                  >
                    <span className="material-icons text-sm">sync</span>
                    Status
                  </button>
                  <button
                    onClick={() => deleteCat(cat.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Usuń"
                  >
                    <span className="material-icons text-sm">delete</span>
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