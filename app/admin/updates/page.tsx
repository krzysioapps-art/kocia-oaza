"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Update {
    id: string;
    title: string;
    content: string;
    is_published: boolean;
    created_at: string;
    media_url: string | null;
    media_type: "image" | "video";
    cat: {
        name: string;
    } | null;
}

export default function UpdatesListPage() {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        const { data, error } = await supabase
            .from("updates")
            .select(`
                *,
                cat:cats(name)
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setUpdates(data || []);
        }

        setLoading(false);
    };

    const deleteUpdate = async (id: string) => {
        if (!confirm("Na pewno usunąć post?")) return;

        const { error } = await supabase
            .from("updates")
            .delete()
            .eq("id", id);

        if (error) {
            alert("Błąd usuwania");
        } else {
            setUpdates((prev) => prev.filter((u) => u.id !== id));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <span className="animate-spin text-4xl">🔄</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Aktualności</h1>

                <Link
                    href="/admin/updates/new"
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                >
                    + Nowy post
                </Link>
            </div>

            {/* List */}
            <div className="space-y-4">
                {updates.map((u) => (
                    <div
                        key={u.id}
                        className="bg-white border rounded-xl p-4 flex gap-4 items-center"
                    >
                        {/* Media */}
                        {u.media_url && (
                            u.media_type === "image" ? (
                                <img
                                    src={u.media_url}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            ) : (
                                <video
                                    src={u.media_url}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            )
                        )}

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                                {u.title}
                            </h3>

                            <p className="text-sm text-gray-600 line-clamp-2">
                                {u.content}
                            </p>

                            <div className="text-xs text-gray-500 mt-1 flex gap-3">
                                <span>
                                    {new Date(u.created_at).toLocaleDateString()}
                                </span>

                                {u.cat && (
                                    <span>🐱 {u.cat.name}</span>
                                )}

                                <span
                                    className={
                                        u.is_published
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }
                                >
                                    {u.is_published ? "Opublikowany" : "Draft"}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Link
                                href={`/admin/updates/${u.id}`}
                                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                ✏️
                            </Link>

                            <button
                                onClick={() => deleteUpdate(u.id)}
                                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {updates.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    Brak postów
                </div>
            )}
        </div>
    );
}