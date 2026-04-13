"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Group {
    id: string;
    name: string;
    description: string | null;
    adoption_type: string;
}

interface Cat {
    id: string;
    name: string;
    status: string;
}

export default function EditGroupPage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [group, setGroup] = useState<Group | null>(null);
    const [cats, setCats] = useState<Cat[]>([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        adoption_type: "required",
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // 🔥 grupa
            const { data: groupData, error: groupError } = await supabase
                .from("cat_groups")
                .select("*")
                .eq("id", id)
                .single();

            if (groupError) throw groupError;

            setGroup(groupData);
            setForm({
                name: groupData.name,
                description: groupData.description || "",
                adoption_type: groupData.adoption_type,
            });

            // 🔥 koty w grupie
            const { data: members } = await supabase
                .from("cat_group_members")
                .select("cat_id")
                .eq("group_id", id);

            const catIds = members?.map((m) => m.cat_id) || [];

            if (catIds.length > 0) {
                const { data: catsData } = await supabase
                    .from("cats")
                    .select("id, name, status")
                    .in("id", catIds);

                setCats(catsData || []);
            }

        } catch (err) {
            console.error(err);
            alert("Błąd ładowania grupy");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from("cat_groups")
                .update({
                    name: form.name,
                    description: form.description || null,
                    adoption_type: form.adoption_type,
                })
                .eq("id", id);

            if (error) throw error;

            alert("Zapisano zmiany!");
        } catch (err) {
            console.error(err);
            alert("Błąd zapisu");
        } finally {
            setSaving(false);
        }
    };

    const removeCat = async (catId: string) => {
        if (!confirm("Usunąć kota z grupy?")) return;

        try {
            await supabase
                .from("cat_group_members")
                .delete()
                .eq("cat_id", catId)
                .eq("group_id", id);

            setCats((prev) => prev.filter((c) => c.id !== catId));
        } catch (err) {
            console.error(err);
            alert("Błąd usuwania");
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Ładowanie...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">
                    Edytuj grupę
                </h1>
                <p className="text-sm text-gray-600">
                    Zarządzaj ustawieniami i przypisanymi kotami
                </p>
            </div>
            {/* FORM */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Edycja grupy
                </h2>

                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nazwa
                        </label>
                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opis
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent transition-all"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Typ adopcji
                        </label>

                        <select
                            value={form.adoption_type}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    adoption_type: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent transition-all"
                        >
                            <option value="required">Muszą razem</option>
                            <option value="preferred">Preferowane razem</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <Link
                        href="/admin/groups"
                        className="px-6 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                    >
                        Wróć
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-xl font-semibold hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {saving ? "Zapisywanie..." : "Zapisz"}
                    </button>
                </div>
            </form>

            {/* CATS IN GROUP */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Koty w tej grupie ({cats.length})
                </h3>

                <div className="space-y-3">
                    {cats.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-gray-100 transition-colors"
                        >
                            <div>
                                <p className="font-medium">{cat.name}</p>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                    {cat.status}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/cats/${cat.id}/edit`}
                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                >
                                    Edytuj
                                </Link>

                                <button
                                    onClick={() => removeCat(cat.id)}
                                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                >
                                    Usuń
                                </button>
                            </div>
                        </div>
                    ))}

                    {cats.length === 0 && (
                        <p className="text-sm text-gray-500">
                            Brak kotów w tej grupie
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}