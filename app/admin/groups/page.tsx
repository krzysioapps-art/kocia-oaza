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
            // 🔥 pobierz grupy
            const { data: groupsData, error } = await supabase
                .from("cat_groups")
                .select("*");

            if (error) throw error;

            // 🔥 pobierz liczby kotów
            const { data: members } = await supabase
                .from("cat_group_members")
                .select("group_id");

            // policz ile kotów w każdej grupie
            const counts: Record<string, number> = {};

            members?.forEach((m) => {
                counts[m.group_id] = (counts[m.group_id] || 0) + 1;
            });

            // połącz dane
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
            // usuń powiązania
            await supabase
                .from("cat_group_members")
                .delete()
                .eq("group_id", id);

            // usuń grupę
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
        return <div className="p-10 text-center">Ładowanie...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Grupy adopcyjne ({groups.length})
                </h1>

                <Link
                    href="/admin/groups/new"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                >
                    + Nowa grupa
                </Link>
            </div>

            {/* LISTA */}
            <div className="space-y-4">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className="bg-white border rounded-xl p-5 shadow-sm flex justify-between items-center"
                    >
                        {/* LEWA */}
                        <div>
                            <h2 className="font-semibold text-lg">
                                {group.name}
                            </h2>

                            {group.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {group.description}
                                </p>
                            )}

                            <div className="flex gap-3 mt-2 text-xs">

                                <span className="bg-gray-100 px-2 py-1 rounded">
                                    {group.adoption_type === "required"
                                        ? "Muszą razem"
                                        : "Preferowane razem"}
                                </span>

                                <span className="bg-gray-100 px-2 py-1 rounded">
                                    🐾 {group.cats_count} kotów
                                </span>
                            </div>
                        </div>

                        {/* PRAWA */}
                        <div className="flex gap-2">
                            <Link
                                href={`/admin/groups/${group.id}/edit`}
                                className="px-3 py-2 border rounded-lg"
                            >
                                Edytuj
                            </Link>

                            <button
                                onClick={() => handleDelete(group.id)}
                                className="px-3 py-2 border rounded-lg text-red-600"
                            >
                                Usuń
                            </button>
                        </div>
                    </div>
                ))}

                {groups.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        Brak grup
                    </div>
                )}
            </div>
        </div>
    );
}