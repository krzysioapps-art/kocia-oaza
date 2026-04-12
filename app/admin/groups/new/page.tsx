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
        <div className="max-w-2xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-lg font-bold mb-4">
                        Nowa grupa adopcyjna
                    </h2>

                    {/* NAME */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">
                            Nazwa grupy *
                        </label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="np. Luna & Leo"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mb-4">
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
                            placeholder="Krótki opis relacji kotów..."
                        />
                    </div>

                    {/* TYPE */}
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
                <div className="flex gap-4">
                    <Link
                        href="/admin/cats"
                        className="px-6 py-3 border rounded-lg"
                    >
                        Anuluj
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg"
                    >
                        {loading ? "Zapisywanie..." : "Utwórz grupę"}
                    </button>
                </div>
            </form>
        </div>
    );
}