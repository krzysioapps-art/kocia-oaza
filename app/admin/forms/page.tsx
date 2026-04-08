"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Form {
  id: string;
  cat_slug: string;
  data: any;
  created_at: string;
  status: string;
}

export default function AdminFormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [filter, setFilter] = useState<"all" | "recent">("all");
  const [catNames, setCatNames] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchForms();
    fetchCatNames();
  }, [filter]);

  async function fetchCatNames() {
    const { data } = await supabase
      .from("cats")
      .select("slug, name")
      .is("deleted_at", null);

    const names: Record<string, string> = {};
    data?.forEach((cat) => {
      names[cat.slug] = cat.name;
    });
    setCatNames(names);
  }

  async function fetchForms() {
    setLoading(true);

    let query = supabase
      .from("adoption_forms")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "recent") {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      query = query.gte("created_at", date.toISOString());
    }

    const { data } = await query;
    setForms(data || []);
    setLoading(false);
  }

  async function deleteForm(id: string) {
    if (!confirm("Czy na pewno chcesz usunąć to zgłoszenie?")) return;

    await supabase.from("adoption_forms").delete().eq("id", id);
    fetchForms();
    setSelectedForm(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-icons animate-spin text-6xl text-[var(--paw-orange)]">refresh</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === "all"
              ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Wszystkie ({forms.length})
        </button>
        <button
          onClick={() => setFilter("recent")}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === "recent"
              ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Ostatnie 7 dni
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Wszystkie zgłoszenia</p>
          <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-700 mb-1">Ostatnie 7 dni</p>
          <p className="text-2xl font-bold text-green-700">
            {forms.filter((f) => {
              const date = new Date(f.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return date > weekAgo;
            }).length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-700 mb-1">Dzisiaj</p>
          <p className="text-2xl font-bold text-blue-700">
            {forms.filter((f) => {
              const formDate = new Date(f.created_at).toDateString();
              const today = new Date().toDateString();
              return formDate === today;
            }).length}
          </p>
        </div>
      </div>

      {/* List */}
      {forms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <span className="material-icons text-6xl text-gray-300 mb-4">description</span>
          <p className="text-gray-500">Brak zgłoszeń</p>
        </div>
      ) : (
        <div className="space-y-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedForm(form)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{form.data.name}</h3>
                    <span className="text-gray-400">•</span>
                    <span className="text-[var(--paw-orange)] font-semibold flex items-center gap-1">
                      <span className="material-icons text-sm">pets</span>
                      {catNames[form.cat_slug] || form.cat_slug}
                    </span>
                  </div>

                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">email</span>
                      {form.data.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">phone</span>
                      {form.data.phone}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {new Date(form.created_at).toLocaleDateString("pl-PL", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(form.created_at).toLocaleTimeString("pl-PL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Zgłoszenie adopcyjne</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedForm.created_at).toLocaleString("pl-PL")}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedForm(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Cat Info */}
              <div className="bg-gradient-to-r from-[var(--soft-peach)] to-[var(--gentle-rose)] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[var(--deep-brown)] font-semibold">
                  <span className="material-icons">pets</span>
                  Kot: {catNames[selectedForm.cat_slug] || selectedForm.cat_slug}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="material-icons text-[var(--paw-orange)]">person</span>
                  Dane kontaktowe
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-24">Imię:</span>
                    {selectedForm.data.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-24">Email:</span>
                    <a href={`mailto:${selectedForm.data.email}`} className="text-blue-600 hover:underline">
                      {selectedForm.data.email}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-24">Telefon:</span>
                    <a href={`tel:${selectedForm.data.phone}`} className="text-blue-600 hover:underline">
                      {selectedForm.data.phone}
                    </a>
                  </p>
                </div>
              </div>

              {/* Housing */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="material-icons text-[var(--paw-orange)]">home</span>
                  Mieszkanie
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-32">Typ:</span>
                    {selectedForm.data.housingType}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-32">Balkon:</span>
                    {selectedForm.data.hasBalcony}
                  </p>
                  {selectedForm.data.balconySecured && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 w-32">Zabezpieczony:</span>
                      {selectedForm.data.balconySecured}
                    </p>
                  )}
                </div>
              </div>

              {/* Household */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="material-icons text-[var(--paw-orange)]">group</span>
                  Domownicy
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-32">Liczba osób:</span>
                    {selectedForm.data.householdSize}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-32">Dzieci:</span>
                    {selectedForm.data.hasChildren}
                  </p>
                  {selectedForm.data.childrenAges && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 w-32">Wiek dzieci:</span>
                      {selectedForm.data.childrenAges}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-32">Zgoda:</span>
                    {selectedForm.data.allAgreeOnCat}
                  </p>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="material-icons text-[var(--paw-orange)]">medical_services</span>
                  Doświadczenie i opieka
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-40">Czas samotności:</span>
                    {selectedForm.data.timeAlone}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-40">Miał kota wcześniej:</span>
                    {selectedForm.data.hadCatBefore}
                  </p>
                  {selectedForm.data.previousCatExperience && (
                    <div className="mt-2">
                      <span className="font-semibold text-gray-700 block mb-1">Doświadczenie:</span>
                      <p className="text-gray-600 whitespace-pre-wrap bg-white p-3 rounded-lg">
                        {selectedForm.data.previousCatExperience}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Motivation */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="material-icons text-[var(--paw-orange)]">favorite</span>
                  Motywacja
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedForm.data.whyAdopt}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl flex gap-3">
              <a
                href={`mailto:${selectedForm.data.email}`}
                className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                <span className="material-icons text-sm">email</span>
                Wyślij email
              </a>
              <a
                href={`tel:${selectedForm.data.phone}`}
                className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium"
              >
                <span className="material-icons text-sm">phone</span>
                Zadzwoń
              </a>

              <div className="flex-1"></div>

              <button
                onClick={() => deleteForm(selectedForm.id)}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                <span className="material-icons text-sm">delete</span>
                Usuń
              </button>

              <button
                onClick={() => setSelectedForm(null)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}