"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MediaUploader from "@/components/MediaUploader";

export default function EditUpdatePage() {
    const params = useParams();
    const router = useRouter();
    const updateId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [cats, setCats] = useState<any[]>([]);
    const [media, setMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);

    const [form, setForm] = useState({
        title: "",
        content: "",
        cat_id: "",
        is_published: true,
    });

    useEffect(() => {
        fetchData();
    }, [updateId]);

    const fetchData = async () => {
        try {
            // 🔥 fetch post
            const { data, error } = await supabase
                .from("updates")
                .select("*")
                .eq("id", updateId)
                .single();

            if (error) throw error;

            setForm({
                title: data.title || "",
                content: data.content || "",
                cat_id: data.cat_id || "",
                is_published: data.is_published,
            });

            if (data.media_url) {
                setMedia({
                    url: data.media_url,
                    type: data.media_type || "image",
                });
            }

            // 🔥 fetch cats
            const { data: catsData } = await supabase
                .from("cats")
                .select("id, name");

            setCats(catsData || []);
        } catch (err) {
            console.error(err);
            alert("Błąd ładowania posta");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from("updates")
                .update({
                    title: form.title,
                    content: form.content,
                    cat_id: form.cat_id || null,
                    media_url: media?.url || null,
                    media_type: media?.type || "image",
                    is_published: form.is_published,
                })
                .eq("id", updateId);

            if (error) throw error;

            alert("Zapisano zmiany!");
            router.push("/admin/updates");
        } catch (err) {
            console.error(err);
            alert("Błąd zapisu");
        } finally {
            setSaving(false);
        }
    };

    const handleUpload = (url: string, type: "image" | "video") => {
        setMedia({ url, type });
    };

    const removeMedia = () => {
        setMedia(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <span className="animate-spin text-4xl">🔄</span>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edytuj post</h1>

                <Link
                    href="/admin/updates"
                    className="text-gray-600 hover:underline"
                >
                    ← Powrót
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Title */}
                <input
                    type="text"
                    required
                    placeholder="Tytuł"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                    className="w-full border px-4 py-2 rounded-lg"
                />

                {/* Content */}
                <textarea
                    rows={6}
                    placeholder="Treść posta..."
                    value={form.content}
                    onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                    }
                    className="w-full border px-4 py-2 rounded-lg"
                />

                {/* Cat */}
                <select
                    value={form.cat_id}
                    onChange={(e) =>
                        setForm({ ...form, cat_id: e.target.value })
                    }
                    className="w-full border px-4 py-2 rounded-lg"
                >
                    <option value="">Bez przypisanego kota</option>
                    {cats.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                {/* Media */}
                <div>
                    <MediaUploader
                        catId={"updates-temp"}
                        onUploadComplete={handleUpload}
                    />

                    {media && (
                        <div className="mt-4 relative">
                            {media.type === "image" ? (
                                <img
                                    src={media.url}
                                    className="h-40 rounded-lg"
                                />
                            ) : (
                                <video
                                    src={media.url}
                                    className="h-40 rounded-lg"
                                />
                            )}

                            <button
                                type="button"
                                onClick={removeMedia}
                                className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm"
                            >
                                ❌
                            </button>
                        </div>
                    )}
                </div>

                {/* Publish */}
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={form.is_published}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                is_published: e.target.checked,
                            })
                        }
                    />
                    Opublikowany
                </label>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        href="/admin/updates"
                        className="px-4 py-2 border rounded-lg"
                    >
                        Anuluj
                    </Link>

                    <button
                        disabled={saving}
                        className="flex-1 bg-orange-500 text-white py-2 rounded-lg"
                    >
                        {saving ? "Zapisywanie..." : "Zapisz zmiany"}
                    </button>
                </div>
            </form>
        </div>
    );
}