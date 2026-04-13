"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Group {
    id: string;
    name: string;
    description: string | null;
    adoption_type: string;
    cats_count: number;
}

export default function GroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const { data: groupsData, error } = await supabase
                .from("cat_groups")
                .select("*");

            if (error) throw error;

            const { data: members } = await supabase
                .from("cat_group_members")
                .select("group_id");

            const counts: Record<string, number> = {};
            members?.forEach((m) => {
                counts[m.group_id] = (counts[m.group_id] || 0) + 1;
            });

            const mapped: Group[] = (groupsData || []).map((g) => ({
                ...g,
                cats_count: counts[g.id] || 0,
            }));

            setGroups(mapped);
        } catch (err) {
            console.error(err);
            alert("Błąd ładowania grup");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Usunąć grupę?")) return;

        try {
            await supabase
                .from("cat_group_members")
                .delete()
                .eq("group_id", id);

            const { error } = await supabase
                .from("cat_groups")
                .delete()
                .eq("id", id);

            if (error) throw error;

            fetchGroups();
        } catch (err) {
            console.error(err);
            alert("Błąd usuwania");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-lg text-gray-600">Ładowanie grup...</div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4">

            {/* HEADER */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Grupy adopcyjne
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Zarządzaj grupami kotów do wspólnej adopcji
                    </p>
                </div>

                <Link
                    href="/admin/groups/new"
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    Dodaj grupę
                </Link>
            </div>

            {/* STATYSTYKI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Wszystkie grupy</div>
                    <div className="text-2xl font-bold text-gray-800">{groups.length}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Wymagana adopcja razem</div>
                    <div className="text-2xl font-bold text-orange-600">
                        {groups.filter(g => g.adoption_type === "required").length}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Preferowana razem</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {groups.filter(g => g.adoption_type === "recommended").length}
                    </div>
                </div>
            </div>

            {/* LISTA GRUP */}
            <div className="space-y-4">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all p-4"
                    >
                        <div className="flex justify-between items-start gap-4">

                            {/* LEWA STRONA */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {group.name}
                                    </h2>

                                    {group.adoption_type === "required" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-orange-50 text-orange-700 border-orange-200">
                                            Wymagana razem
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                                            Preferowana razem
                                        </span>
                                    )}
                                </div>

                                {group.description && (
                                    <p className="text-gray-600 mb-3">
                                        {group.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        🐾 <strong>{group.cats_count}</strong> {group.cats_count === 1 ? 'kot' : 'kotów'}
                                    </span>
                                </div>
                            </div>

                            {/* PRAWA STRONA - AKCJE */}
                            <div className="flex gap-2 shrink-0">
                                <Link
                                    href={`/admin/groups/${group.id}/edit`}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                >
                                    Edytuj
                                </Link>

                                <button
                                    onClick={() => handleDelete(group.id)}
                                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    Usuń
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {groups.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🐱</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Brak grup adopcyjnych
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Utwórz pierwszą grupę kotów do wspólnej adopcji
                        </p>
                        <Link
                            href="/admin/groups/new"
                            className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            + Utwórz grupę
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}