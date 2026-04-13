"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddGroupPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        description: "",
        adoption_type: "required", // required | preferred
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from("cat_groups")
                .insert([
                    {
                        name: form.name,
                        description: form.description || null,
                        adoption_type: form.adoption_type,
                    },
                ]);

            if (error) throw error;

            alert("Grupa została utworzona!");
            router.push("/admin/cats");
        } catch (err) {
            console.error(err);
            alert("Błąd podczas tworzenia grupy");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 mx-auto px-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Dodaj grupę
                    </h1>
                    <p className="text-sm text-gray-600">
                        Utwórz grupę kotów do wspólnej adopcji
                    </p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Nowa grupa adopcyjna
                    </h2>

                    {/* NAME */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nazwa grupy *
                        </label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--paw-orange)] focus:border-transparent transition-all"
                            placeholder="np. Luna & Leo"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mb-4">
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
                            placeholder="Krótki opis relacji kotów..."
                        />
                    </div>

                    {/* TYPE */}
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
                            <option value="required">
                                Muszą iść razem
                            </option>
                            <option value="preferred">
                                Preferowane razem
                            </option>
                        </select>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-2">
                    <Link
                        href="/admin/groups"
                        className="px-6 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                    >
                        Anuluj
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Zapisywanie..." : "Utwórz grupę"}
                    </button>
                </div>
            </form>
        </div>
    );
}