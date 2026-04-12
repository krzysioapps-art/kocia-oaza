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
        <div className="max-w-4xl mx-auto px-4 space-y-8">

            {/* FORM */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-lg font-bold mb-4">
                    Edycja grupy
                </h2>

                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Nazwa
                        </label>
                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Opis
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="w-full border rounded-lg px-4 py-2"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
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
                            className="w-full border rounded-lg px-4 py-2"
                        >
                            <option value="required">Muszą razem</option>
                            <option value="preferred">Preferowane razem</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <Link
                        href="/admin/groups"
                        className="px-4 py-2 border rounded-lg"
                    >
                        Wróć
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg"
                    >
                        {saving ? "Zapisywanie..." : "Zapisz"}
                    </button>
                </div>
            </form>

            {/* CATS IN GROUP */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-semibold mb-4">
                    Koty w tej grupie ({cats.length})
                </h3>

                <div className="space-y-3">
                    {cats.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex justify-between items-center border rounded-lg p-3"
                        >
                            <div>
                                <p className="font-medium">{cat.name}</p>
                                <p className="text-xs text-gray-500">
                                    {cat.status}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/cats/${cat.id}/edit`}
                                    className="px-3 py-1 border rounded"
                                >
                                    Edytuj
                                </Link>

                                <button
                                    onClick={() => removeCat(cat.id)}
                                    className="px-3 py-1 border rounded text-red-600"
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