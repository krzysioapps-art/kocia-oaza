"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface DashboardStats {
  catsTotal: number;
  catsAvailable: number;
  catsReserved: number;
  catsAdopted: number;
  catsWithoutPhotos: number;
  formsTotal: number;
  formsLast7Days: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    catsTotal: 0,
    catsAvailable: 0,
    catsReserved: 0,
    catsAdopted: 0,
    catsWithoutPhotos: 0,
    formsTotal: 0,
    formsLast7Days: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    try {
      // Fetch cats data
      const { data: cats } = await supabase
        .from("cats")
        .select("id, status")
        .is("deleted_at", null);

      // Fetch cats with media count
      const { data: catsWithMedia } = await supabase
        .from("cat_media")
        .select("cat_id");

      const catsWithMediaIds = new Set(catsWithMedia?.map(m => m.cat_id) || []);

      // Fetch forms data
      const { data: forms } = await supabase
        .from("adoption_forms")
        .select("id, created_at");

      // Calculate stats
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      setStats({
        catsTotal: cats?.length || 0,
        catsAvailable: cats?.filter(c => c.status === "available").length || 0,
        catsReserved: cats?.filter(c => c.status === "reserved").length || 0,
        catsAdopted: cats?.filter(c => c.status === "adopted").length || 0,
        catsWithoutPhotos: cats?.filter(c => !catsWithMediaIds.has(c.id)).length || 0,
        formsTotal: forms?.length || 0,
        formsLast7Days: forms?.filter(f => new Date(f.created_at) > sevenDaysAgo).length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <span className="material-icons animate-spin text-6xl text-[var(--paw-orange)]">refresh</span>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
     <div className="max-w-5xl mx-auto px-4">
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-gray-600">
          Przegląd statystyk i szybki dostęp do zarządzania kotami i zgłoszeniami
        </p>
      </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/cats/new"
            className="bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <span className="material-icons text-4xl mb-3">add_circle</span>
            <h3 className="text-xl font-bold mb-1">Dodaj kota</h3>
            <p className="text-sm opacity-90">Nowe zgłoszenie do adopcji</p>
          </Link>

          <Link
            href="/admin/cats"
            className="bg-white border-2 border-[var(--warm-coral)] text-[var(--deep-brown)] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <span className="material-icons text-4xl mb-3 text-[var(--paw-orange)]">pets</span>
            <h3 className="text-xl font-bold mb-1">Lista kotów</h3>
            <p className="text-sm text-gray-600">Zarządzaj wszystkimi kotami</p>
          </Link>

          <Link
            href="/admin/forms"
            className="bg-white border-2 border-[var(--warm-coral)] text-[var(--deep-brown)] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <span className="material-icons text-4xl mb-3 text-[var(--paw-orange)]">description</span>
            <h3 className="text-xl font-bold mb-1">Zgłoszenia</h3>
            <p className="text-sm text-gray-600">Formularze adopcyjne</p>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
            Statystyki
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Cats */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="material-icons text-3xl text-blue-500">pets</span>
                <span className="text-3xl font-bold text-gray-900">{stats.catsTotal}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">Wszystkie koty</p>
            </div>

            {/* Available */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="material-icons text-3xl text-green-500">check_circle</span>
                <span className="text-3xl font-bold text-gray-900">{stats.catsAvailable}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">Dostępne</p>
            </div>

            {/* Reserved */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="material-icons text-3xl text-yellow-500">schedule</span>
                <span className="text-3xl font-bold text-gray-900">{stats.catsReserved}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">Zarezerwowane</p>
            </div>

            {/* Adopted */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="material-icons text-3xl text-purple-500">favorite</span>
                <span className="text-3xl font-bold text-gray-900">{stats.catsAdopted}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">Adoptowane</p>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Without Photos */}
          <div className={`rounded-2xl p-6 shadow-md ${
            stats.catsWithoutPhotos > 0 
              ? 'bg-red-50 border-2 border-red-200' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`material-icons text-3xl ${
                stats.catsWithoutPhotos > 0 ? 'text-red-500' : 'text-gray-400'
              }`}>
                image_not_supported
              </span>
              <span className="text-3xl font-bold text-gray-900">{stats.catsWithoutPhotos}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Bez zdjęć</p>
            {stats.catsWithoutPhotos > 0 && (
              <p className="text-xs text-red-600 mt-2">Wymaga uzupełnienia!</p>
            )}
          </div>

          {/* Total Forms */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="material-icons text-3xl text-indigo-500">description</span>
              <span className="text-3xl font-bold text-gray-900">{stats.formsTotal}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Wszystkie zgłoszenia</p>
          </div>

          {/* Recent Forms */}
          <div className={`rounded-2xl p-6 shadow-md ${
            stats.formsLast7Days > 0 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`material-icons text-3xl ${
                stats.formsLast7Days > 0 ? 'text-green-500' : 'text-gray-400'
              }`}>
                new_releases
              </span>
              <span className="text-3xl font-bold text-gray-900">{stats.formsLast7Days}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Nowe (7 dni)</p>
            {stats.formsLast7Days > 0 && (
              <Link href="/admin/forms" className="text-xs text-green-600 mt-2 inline-flex items-center gap-1 hover:underline">
                Zobacz zgłoszenia
                <span className="material-icons text-xs">arrow_forward</span>
              </Link>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Alerts */}
          {(stats.catsWithoutPhotos > 0 || stats.formsLast7Days > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="material-icons text-amber-500">notifications_active</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Wymagają uwagi</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {stats.catsWithoutPhotos > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="material-icons text-xs text-amber-500">warning</span>
                        {stats.catsWithoutPhotos} {stats.catsWithoutPhotos === 1 ? 'kot' : 'kotów'} bez zdjęć
                      </li>
                    )}
                    {stats.formsLast7Days > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="material-icons text-xs text-amber-500">mail</span>
                        {stats.formsLast7Days} nowych zgłoszeń adopcyjnych
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="material-icons text-blue-500">lightbulb</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Wskazówki</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="material-icons text-xs text-blue-500 mt-0.5">arrow_right</span>
                    <span>Każdy kot powinien mieć co najmniej 1 zdjęcie</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-icons text-xs text-blue-500 mt-0.5">arrow_right</span>
                    <span>Regularnie sprawdzaj nowe zgłoszenia adopcyjne</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-icons text-xs text-blue-500 mt-0.5">arrow_right</span>
                    <span>Aktualizuj status kotów po adopcji</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }