"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import MediaUploader from "@/components/MediaUploader";

export default function CreateUpdatePage() {
    const router = useRouter();

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
        fetchCats();
    }, []);

    const fetchCats = async () => {
        const { data } = await supabase.from("cats").select("id, name");
        setCats(data || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase.from("updates").insert({
                type: "update",
                title: form.title,
                content: form.content,
                cat_id: form.cat_id || null,
                media_url: media?.url || null,
                media_type: media?.type || "image",
                is_published: form.is_published,
            });

            if (error) throw error;

            alert("Post dodany!");
            router.push("/admin/updates");
        } catch (err) {
            console.error(err);
            alert("Błąd");
        } finally {
            setSaving(false);
        }
    };

    const handleUpload = (url: string, type: "image" | "video") => {
        setMedia({ url, type });
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Nowa aktualność</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Title */}
                <input
                    type="text"
                    placeholder="Tytuł"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border px-4 py-2 rounded-lg"
                />

                {/* Content */}
                <textarea
                    placeholder="Treść posta..."
                    rows={6}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full border px-4 py-2 rounded-lg"
                />

                {/* Cat (optional) */}
                <select
                    value={form.cat_id}
                    onChange={(e) => setForm({ ...form, cat_id: e.target.value })}
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
                        <div className="mt-4">
                            {media.type === "image" ? (
                                <img src={media.url} className="h-40 rounded-lg" />
                            ) : (
                                <video src={media.url} className="h-40 rounded-lg" />
                            )}
                        </div>
                    )}
                </div>

                {/* Publish */}
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={form.is_published}
                        onChange={(e) =>
                            setForm({ ...form, is_published: e.target.checked })
                        }
                    />
                    Opublikowany
                </label>

                <button
                    disabled={saving}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg"
                >
                    {saving ? "Zapisywanie..." : "Dodaj post"}
                </button>
            </form>
        </div>
    );
}